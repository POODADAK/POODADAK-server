const { USER_LEVEL, SOCIAL_SERVICE } = require("../utils/constants");

const TOILET_ID = "620e02200f0032c94c5405a2";
const USER_ID_NAVER = "620dd31f43443fbb462f8ab5";
const USER_ID_KAKAO = "620dd33543443fbb462f8ac8";
const REVIEW_ID_USER_NAVER = "620e07f7c75d821949cebd76";
const REVIEW_ID_USER_KAKAO = "620f07ac534b651b2e275e2a";

exports.validMockToilet = {
  _id: TOILET_ID,
  toiletType: "공중화장실",
  toiletName: "삼성",
  roadNameAddress: "서울특별시 강남구 테헤란로 지하538",
  indexNameAddress: "서울특별시 강남구 삼성동 172-82",
  isUnisexToilet: false,
  menToiletBowlNumber: 4,
  menUrinalNumber: 8,
  menHandicapToiletBowlNumber: 2,
  menHandicapUrinalNumber: 0,
  menChildrenToiletBowlNumber: 0,
  menChildrenUrinalNumber: 1,
  ladiesToiletBowlNumber: 13,
  ladiesHandicapToiletBowlNumber: 2,
  ladiesChildrenToiletBowlNumber: 0,
  institutionName: "서울교통공사",
  phoneNumber: "02-6110-2191",
  openTime: "05:00~01:00",
  installationYear: 2009,
  referenceDate: "2018-02-28",
  institutionCode: null,
  latestToiletPaperInfo: {
    lastDate: "",
    hasToiletPaper: false,
  },
  location: {
    type: "Point",
    coordinates: [127.063067, 37.508826],
  },
  reviewList: [REVIEW_ID_USER_NAVER, REVIEW_ID_USER_KAKAO],
  isSOS: true,
  __v: 0,
};

exports.validMockUserNAVER = {
  _id: USER_ID_NAVER,
  username: "푸다닥-네이버",
  level: USER_LEVEL.BRONZE,
  email: "poodadak.naver@gmail.com",
  socialService: SOCIAL_SERVICE.NAVER,
  reviewList: [REVIEW_ID_USER_NAVER],
  __v: 0,
};

exports.validMockUserKAKAO = {
  _id: USER_ID_KAKAO,
  username: "푸다닥-카카오",
  level: USER_LEVEL.BRONZE,
  email: "poodadak.kakao@gmail.com",
  socialService: SOCIAL_SERVICE.KAKAO,
  reviewList: [REVIEW_ID_USER_KAKAO],
  __v: 0,
};

exports.validMockReviewUserNAVER = {
  _id: REVIEW_ID_USER_NAVER,
  writer: USER_ID_NAVER,
  toilet: TOILET_ID,
  rating: 5,
  hasToiletPaper: false,
  description: "배포성공 네이버",
  image:
    "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
  updatedAt: "2022-02-17T08:31:50.922Z",
  __v: 0,
};

exports.validMockReviewUserKAKAO = {
  _id: REVIEW_ID_USER_KAKAO,
  writer: USER_ID_KAKAO,
  toilet: TOILET_ID,
  rating: 5,
  hasToiletPaper: false,
  description: "배포성공 카카오",
  image:
    "https://poodadak-image.s3.ap-northeast-2.amazonaws.com/a59c4347690b0c6fb5edcbfc412eeb8a",
  updatedAt: "2022-02-18T08:31:50.922Z",
  __v: 0,
};
