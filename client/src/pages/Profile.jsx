import { useSelector } from "react-redux";
import { useRef } from "react";


export default function Profile() {
  const { currentUser } = useSelector((stat) => stat.user);
  const fileRef = useRef();

  const handleChange = () => {
  }
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input type="text"
        placeholder="username"
        onChange={handleChange}
        defaultValue= {currentUser.username}
        className="rounded-lg p-3 border"
         />
        <input type="email"
        placeholder="email"
        onChange={handleChange}
        defaultValue= {currentUser.email}
        className="rounded-lg p-3 border"
         />
        <input type="password" 
        placeholder="password"
        onChange={handleChange}
        defaultValue= {currentUser.password}
        className="rounded-lg p-3 border"
         />
      </form>
    </div>
  );
}
