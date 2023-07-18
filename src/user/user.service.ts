import { ConflictException, Injectable, Body, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserIntroductionDto, UpdateUserNicknameDto, UpdateCommonWhere as UpdateUserDto } from './dto/update-user.dto';
import { UserDeleteWhereDto } from './dto/delete-user.dto';
import { deleteObject } from '../common/util/deleteObjectFromS3';
import { S3Client } from '@aws-sdk/client-s3';
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }


  findUser(uniqueValue: {
    email: string,
  } | {
    nickName: string
  }) {
    return this.userRepository.findOne(uniqueValue);
  }

  async signUp(userDto: CreateUserDto) {
    await this.userRepository.createUser(userDto);
  }

  // refresh token 기간 끝 OR 가입
  async sign(userDto: CreateUserDto) {

    // 가입 여부 확인
    let userInfo = await this.userRepository.findOne({ email: userDto.email });

    if (userInfo !== null) {
      return userInfo;
    }

    // 가입되지 않은 경우 자동 가입
    await this.signUp(userDto);

    userInfo = await this.findUser({ email: userDto.email });

    return userInfo;
  }

  // 닉네임 중복 체크
  async nicknameDuplicateCheck(nickName: string, type: string = 'check') {
    const isExist = await this.findUser({ nickName });

    // 없는 경우
    if (isExist === null) {
      return true;
    }

    // 있는 경우
    if (type === 'check') {
      return false;
    }

    throw new ConflictException();
  }

  // 닉네임 수정 
  async editNickname(updateUserNicknameDto: UpdateUserNicknameDto) {
    const isNotExist = await this.nicknameDuplicateCheck(updateUserNicknameDto.data.nickName);

    if (isNotExist) {
      const userInfo = await this.userRepository.updateUser(updateUserNicknameDto);
      return { nickName: userInfo.nickName };
    }

    throw new ConflictException();
  }

  // 자기 소개 수정
  async editIntroduction(updateUserIntroductionDto: UpdateUserIntroductionDto) {
    const userInfo = await this.userRepository.updateUser(updateUserIntroductionDto);
    return { introduction: userInfo.introduction };
  }

  // 회원 탈퇴
  async withdraw(userInfo: UserDeleteWhereDto) {
    const result = await this.userRepository.deleteUser({ email: userInfo.where.email });
    return result;
  }

  // 이미지 수정
  async editPicture(updateUserDto, req) {
    // 이미지 파일 보내지 않은 경우
    const fileValidationError = req.fileValidationError;
    if (fileValidationError !== 'format does fit') {
      console.log(fileValidationError)
      console.log("%%")
      throw new UnprocessableEntityException();
    }
    // 이미지 파일 형식이 맞지 않은 경우
    else if (fileValidationError === "format doesn't fit") {
      throw new UnsupportedMediaTypeException();
    }
    // 이미지 저장 후 url 가져오기
    const picture = req?.files[0].location;
    const email = updateUserDto;
    const updateUserPictureDto = { where: { email }, data: { picture } }

    // 기존 S3 이미지 삭제
    const previousUserInfo = await this.userRepository.findOne({ email });
    const key = previousUserInfo.picture;

    // S3 이미지 형식일때 삭제
    if (key.split('.')[1] !== 'google') {
      deleteObject([key]);
    }

    // 새로운 이미지 저장
    const userInfo = await this.userRepository.updateUser(updateUserPictureDto);

    return { picture: userInfo.picture };
  }
}