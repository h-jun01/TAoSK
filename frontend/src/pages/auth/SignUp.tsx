import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regexEmail, regexPassword, regexText } from 'consts/regex';
import { occupationList } from 'consts/occupationList';
import { companyList } from 'consts/companyList';
import { firebaseAuth } from 'utils/lib/firebase/firebaseAuth';
import { useInput } from 'hooks/useInput';
import { useSelectBox } from 'hooks/useSelectBox';
import { useAuthContext } from 'context/AuthProvider';
import {
  useAddUserMutation,
  useAddQualificationMutation,
  useAddInterestMutation,
} from './signUp.gen';
import { useGetUserByIdLazyQuery } from './document.gen';

export const SignUp: FC = () => {
  const { currentUser } = useAuthContext();
  const [addUserMutation, { loading, error }] = useAddUserMutation();
  const [addQualificationMutation] = useAddQualificationMutation();
  const [addInterestMutation] = useAddInterestMutation();
  const [tryGetUserById, { data }] = useGetUserByIdLazyQuery();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const navigate = useNavigate();
  const email = useInput('');
  const password = useInput('');
  const name = useInput('');
  const company = useSelectBox('');
  const occupation = useSelectBox('');

  useEffect(() => {
    if (
      regexEmail.test(email.value) &&
      regexPassword.test(password.value) &&
      regexText.test(name.value) &&
      company.value &&
      occupation.value
    )
      return setIsDisabled(false);
    setIsDisabled(true);
  }, [
    company.value,
    email.value,
    name.value,
    occupation.value,
    password.value,
  ]);

  useEffect(() => {
    if (!currentUser) return;
    tryGetUserById({ variables: { id: currentUser.uid } });
    if (!data) return;
    navigate('/');
  }, [currentUser, data, navigate, tryGetUserById]);

  const addUser = (id: string) => {
    addUserMutation({
      variables: {
        id,
        name: name.value,
        icon_image: 'http:aaa',
        companies_id: companyList.indexOf(company.value) + 1,
        occupation_id: occupationList.indexOf(occupation.value) + 1,
      },
    });
  };

  const addQualification = (id: string) => {
    ['資格1', '資格2', '資格3'].forEach((item) => {
      addQualificationMutation({
        variables: {
          user_id: id,
          name: item,
        },
      });
    });
  };

  const addInterest = (id: string) => {
    ['興味1', '興味2', '興味3'].forEach((item) => {
      addInterestMutation({
        variables: {
          user_id: id,
          context: item,
        },
      });
    });
  };

  const trySingUp = () => {
    firebaseAuth
      .createUser(email.value, password.value)
      .then(async (result) => {
        await Promise.all([
          addUser(result.user.uid),
          addQualification(result.user.uid),
          addInterest(result.user.uid),
        ]).then(() => navigate('/'));
      });
  };

  return (
    <div>
      <h1>新規登録</h1>
      <input type="text" placeholder="メールアドレスを入力" {...email} />
      <input
        type="password"
        placeholder="パスワードを入力"
        minLength={6}
        {...password}
      />
      <input type="text" placeholder="名前を入力" {...name} />
      <select required {...company}>
        <option value="">所属企業を選択してください</option>
        {companyList.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
      <select required {...occupation}>
        <option value="">職種を選択してください</option>
        {occupationList.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>

      <button disabled={isDisabled} onClick={trySingUp}>
        登録するボタン
      </button>
    </div>
  );
};
