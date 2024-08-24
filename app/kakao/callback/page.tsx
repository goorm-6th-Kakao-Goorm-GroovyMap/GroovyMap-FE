'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { userState } from '@/recoil/state/userState';

const KakaoCallback = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const handleKakaoLogin = async () => {
      const code = new URL(window.location.href).searchParams.get('code');

      if (code) {
        try {
          const response = await apiClient.post('/kakao/callback', { code });
          const { loginStatus, email, nickname } = response.data;

          switch (loginStatus) {
            case 'LOGIN_SUCCESS':
              // 로그인 성공 시, 마이페이지로 이동
              setUser({
                nickname : nickname
              });
              router.push(`/mypage/${nickname}`);
              break;
            case 'SAME_EMAIL':
              // 같은 이메일이 존재할 때 경고 메시지 띄우고 로그인 페이지로 리다이렉트
              toast.error('이미 존재하는 이메일입니다. 다른 로그인 방식을 선택해주세요.');
              router.push('/login');
              break;
            case 'SAME_NICKNAME':
              // 같은 닉네임이 존재할 때 회원가입 페이지로 이동하며, 닉네임 입력란은 비워둠
              const sameNicknameParams = new URLSearchParams({ email, nickname: '' }).toString();
              router.push(`/signup/nickname-region-part?${sameNicknameParams}`);
              break;
            case 'NEED_REGISTER':
              // 회원가입이 필요할 때, 회원가입 페이지로 이동
              const needRegisterParams = new URLSearchParams({ email, nickname }).toString();
              router.push(`/signup/nickname-region-part?${needRegisterParams}`);
              break;
            default:
              // 에러 처리
              console.error('Login failed:', response.data);
              toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
              router.push('/login');
          }
        } catch (error) {
          console.error('OAuth 로그인 실패:', error);
          toast.error('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
          router.push('/login');
        }
      }
    };

    handleKakaoLogin();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-circle"></div>
    </div>
  );
};

export default KakaoCallback;
