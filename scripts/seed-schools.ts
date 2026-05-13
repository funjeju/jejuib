import * as admin from 'firebase-admin';
import { SCHOOLS } from '../app/data/schools';

// Firebase Admin 초기화 (환경 변수 필요)
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

const db = admin.firestore();

async function seedSchools() {
  console.log('🌱 학교 데이터 시드 시작...');

  try {
    const batch = db.batch();
    let count = 0;

    for (const school of SCHOOLS) {
      const docRef = db.collection('schools').doc(school.id);
      batch.set(docRef, {
        ...school,
        ratingAvg: 0,
        reviewCount: 0,
        postCount: 0,
      });
      count++;
    }

    await batch.commit();
    console.log(`✅ ${count}개 학교 데이터 업로드 완료`);
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러:', error);
    process.exit(1);
  }
}

seedSchools();
