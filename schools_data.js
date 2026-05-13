/* =========================================================================
   IB SCHOOLS DATA — 이 파일을 수정하여 학교를 추가/수정하세요
   stage:    "인증" | "후보" | "관심"
   level:    "초등" | "중등" | "고등" | "통합"
   type:     "국제학교" | "공립" | "사립"
   programs: ["PYP","MYP","DP","CP"] subset
   ========================================================================= */
const SCHOOLS = [
  // ─────────── 국제학교 (인증) ───────────
  { name: "서울외국인학교", nameEn: "Seoul Foreign School", region: "서울", city: "서대문구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 37.5754, lng: 126.9412 },
  { name: "드와이트 스쿨 서울", nameEn: "Dwight School Seoul", region: "서울", city: "마포구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 37.5806, lng: 126.8932 },
  { name: "덜위치 칼리지 서울", nameEn: "Dulwich College Seoul", region: "서울", city: "서초구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP"], lat: 37.4961, lng: 127.0177 },
  { name: "한국외국인학교", nameEn: "Korea Foreign School", region: "서울", city: "성북구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP"], lat: 37.6047, lng: 127.0142 },
  { name: "한국국제학교 판교", nameEn: "Korea International School Pangyo", region: "경기", city: "성남시", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","DP"], lat: 37.4012, lng: 127.1086 },
  { name: "채드윅 송도국제학교", nameEn: "Chadwick International", region: "인천", city: "연수구 송도동", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 37.3826, lng: 126.6566 },
  { name: "경기수원외국인학교", nameEn: "Gyeonggi Suwon International School", region: "경기", city: "수원시", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 37.2636, lng: 127.0286 },
  { name: "부산국제외국인학교", nameEn: "International School of Busan", region: "부산", city: "기장군", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 35.2444, lng: 129.2228 },
  { name: "대전외국인학교", nameEn: "Taejon Christian International School", region: "대전", city: "유성구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 36.3624, lng: 127.3559 },
  { name: "대구국제학교", nameEn: "Daegu International School", region: "대구", city: "동구", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 35.8867, lng: 128.6359 },
  { name: "경남국제외국인학교", nameEn: "Gyeongnam International Foreign School", region: "경남", city: "사천시", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 35.0036, lng: 128.0640 },
  { name: "브랭섬홀 아시아", nameEn: "Branksome Hall Asia", region: "제주", city: "서귀포시 대정읍", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 33.2299, lng: 126.2629 },
  { name: "NLCS 제주", nameEn: "North London Collegiate School Jeju", region: "제주", city: "서귀포시 대정읍", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","MYP","DP"], lat: 33.2305, lng: 126.2660 },
  { name: "세인트존스베리 아카데미 제주", nameEn: "St. Johnsbury Academy Jeju", region: "제주", city: "서귀포시 대정읍", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","DP"], lat: 33.2310, lng: 126.2700 },
  { name: "한국국제학교 제주", nameEn: "Korea International School Jeju", region: "제주", city: "서귀포시 대정읍", level: "통합", type: "국제학교", stage: "인증", programs: ["PYP","DP"], lat: 33.2315, lng: 126.2740 },

  // ─────────── 제주 공립 (인증) ───────────
  { name: "표선고등학교", nameEn: "Pyoseon High School", region: "제주", city: "서귀포시 표선면", level: "고등", type: "공립", stage: "인증", programs: ["DP"], lat: 33.3267, lng: 126.8328 },
  { name: "표선중학교", nameEn: "Pyoseon Middle School", region: "제주", city: "서귀포시 표선면", level: "중등", type: "공립", stage: "인증", programs: ["MYP"], lat: 33.3287, lng: 126.8310 },
  { name: "표선초등학교", nameEn: "Pyoseon Elementary School", region: "제주", city: "서귀포시 표선면", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 33.3247, lng: 126.8350 },
  { name: "성산중학교", nameEn: "Seongsan Middle School", region: "제주", city: "서귀포시 성산읍", level: "중등", type: "공립", stage: "인증", programs: ["MYP"], lat: 33.4263, lng: 126.9173 },
  { name: "토산초등학교", nameEn: "Tosan Elementary School", region: "제주", city: "서귀포시 표선면", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 33.3105, lng: 126.8421 },
  { name: "풍천초등학교", nameEn: "Pungcheon Elementary School", region: "제주", city: "제주시", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 33.4513, lng: 126.4938 },
  { name: "온평초등학교", nameEn: "Onpyeong Elementary School", region: "제주", city: "서귀포시 성산읍", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 33.4117, lng: 126.9131 },
  { name: "제주북초등학교", nameEn: "Jeju Buk Elementary School", region: "제주", city: "제주시", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 33.5145, lng: 126.5235 },

  // ─────────── 대구 공립 (인증·후보) ───────────
  { name: "경북대학교사대부설초등학교", nameEn: "KNU Elementary School", region: "대구", city: "북구", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 35.8857, lng: 128.5808 },
  { name: "경북대학교사대부설중학교", nameEn: "KNU Middle School", region: "대구", city: "북구", level: "중등", type: "공립", stage: "인증", programs: ["MYP"], lat: 35.8861, lng: 128.5813 },
  { name: "동덕초등학교", nameEn: "Dongdeok Elementary School", region: "대구", city: "수성구", level: "초등", type: "공립", stage: "인증", programs: ["PYP"], lat: 35.8581, lng: 128.6306 },
  { name: "덕인초등학교", nameEn: "Deokin Elementary School", region: "대구", city: "동구", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.8870, lng: 128.6362 },
  { name: "장산초등학교", nameEn: "Jangsan Elementary School", region: "대구", city: "수성구", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.8590, lng: 128.6320 },
  { name: "삼덕초등학교", nameEn: "Samdeok Elementary School", region: "대구", city: "중구", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.8689, lng: 128.6065 },
  { name: "대구영선초등학교", nameEn: "Daegu Yeongseon Elementary School", region: "대구", city: "중구", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.8693, lng: 128.6072 },
  { name: "개산초등학교", nameEn: "Gaesan Elementary School", region: "대구", city: "달성군", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.7747, lng: 128.4324 },
  { name: "한마음초등학교", nameEn: "Hanmaeum Elementary School", region: "대구", city: "달성군", level: "초등", type: "공립", stage: "후보", programs: ["PYP"], lat: 35.7752, lng: 128.4330 },
  { name: "대명중학교", nameEn: "Daemyeong Middle School", region: "대구", city: "남구", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.8459, lng: 128.5980 },
  { name: "농공중학교", nameEn: "Nongong Middle School", region: "대구", city: "달성군", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.7745, lng: 128.4321 },
  { name: "포산중학교", nameEn: "Posan Middle School", region: "대구", city: "달성군", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.7750, lng: 128.4325 },
  { name: "상수중학교", nameEn: "Sangsuh Middle School", region: "대구", city: "수성구", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.8585, lng: 128.6310 },
  { name: "사수중학교", nameEn: "Sasu Middle School", region: "대구", city: "달성군", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.7740, lng: 128.4315 },
  { name: "서동중학교", nameEn: "Seodong Middle School", region: "대구", city: "달서구", level: "중등", type: "공립", stage: "후보", programs: ["MYP"], lat: 35.8294, lng: 128.5278 },

  // ─────────── 경기 공교육 ───────────
  { name: "군서미래국제학교", nameEn: "Gunseo Global School", region: "경기", city: "시흥시", level: "통합", type: "공립", stage: "인증", programs: ["DP"], lat: 37.3804, lng: 126.8030 },

  // ─────────── 서울 공교육 (대표 후보·관심학교) ───────────
  { name: "흥인초등학교", nameEn: "Heungin Elementary School", region: "서울", city: "동대문구", level: "초등", type: "공립", stage: "관심", programs: ["PYP"], lat: 37.5744, lng: 127.0395 },
  { name: "경동고등학교", nameEn: "Kyungdong High School", region: "서울", city: "성북구", level: "고등", type: "공립", stage: "관심", programs: ["DP"], lat: 37.5894, lng: 127.0167 },
  { name: "청량고등학교", nameEn: "Cheongryang High School", region: "서울", city: "동대문구", level: "고등", type: "공립", stage: "관심", programs: ["DP"], lat: 37.5810, lng: 127.0400 },
  { name: "신서고등학교", nameEn: "Sinseo High School", region: "서울", city: "강서구", level: "고등", type: "공립", stage: "관심", programs: ["DP"], lat: 37.5509, lng: 126.8495 },

  // ─────────── 인천 (IB 중점학교) ───────────
  { name: "박문초등학교", nameEn: "Bakmun Elementary School", region: "인천", city: "남동구", level: "초등", type: "공립", stage: "관심", programs: ["PYP"], lat: 37.4476, lng: 126.7314 },
  { name: "신정중학교", nameEn: "Sinjeong Middle School", region: "인천", city: "남동구", level: "중등", type: "공립", stage: "관심", programs: ["MYP"], lat: 37.4480, lng: 126.7320 }
];
