import styled from "@emotion/styled";
import React, { useState } from "react";
import wallpaper from "../../assets/images/wallpaper.avif";
import Input from "../../components/ui/inputs/input";
import Button from "../../components/ui/button";
import { Link } from "@mui/material";
import { useDispatch } from "react-redux";
import { logIn } from "../../store/auth/auth";
import { toast } from "react-toastify";
import { Image } from "lucide-react";
import logo from '../../assets/images/SewMaster.png';

const SignIn = () => {

  const dispatch = useDispatch();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(logIn({ username: login, password }))
      .then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Добро пожаловать!');
        } else {
          toast.error('Не правильный логин или пароль!');
        }
      })
  }

  return (
    <Wrapper>
      <div className="w-[430px] h-[500px] bg-zinc-100 rounded-2xl flex justify-center items-center shadow shadow-lg">
        <form className="w-4/5 flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center text-primary mb-5">SewMaster</h1>
          <p className="text-xl font-bold text-primary">Добро пожаловать!</p>
          <div className="flex flex-col gap-y-4">
            <Input label="Логин" placeholder={"Введите логин"} value={login} onChange={(e) => setLogin(e.target.value)} type="text"/>
            <Input label="Пароль" placeholder={"Введите пароль"} value={password} onChange={(e) => setPassword(e.target.value)} type='password' eays={true} />
            <Link sx={{ color: "#2F4F4F", textDecoration: 'none', textAlign: 'right', fontSize: "14px", cursor: "pointer", "&:hover": { textDecoration: 'underline'} }}>
                Забыли пароль?
            </Link>
            <Button type='submit'>Войти</Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default SignIn;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${wallpaper});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: auto;
`;
