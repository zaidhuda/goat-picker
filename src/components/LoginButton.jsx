import React, { useContext, useState } from "react";

import { FirebaseContext } from "../contexts";

import { ReactComponent as LightNormal } from "../google_login/btn_google_light_normal_ios.svg";
import { ReactComponent as LightPressed } from "../google_login/btn_google_light_pressed_ios.svg";
// import { ReactComponent as LightDisabled } from "../google_login/btn_google_light_disabled_ios.svg";
// import { ReactComponent as DarkNormal } from "../google_login/btn_google_dark_normal_ios.svg";
// import { ReactComponent as DarkPressed } from "../google_login/btn_google_dark_pressed_ios.svg";
// import { ReactComponent as DarkDisabled } from "../google_login/btn_google_dark_disabled_ios.svg";

const LoginButton = () => {
  const { signInWithPopup } = useContext(FirebaseContext);
  const [GoogleButton, setGoogleButton] = useState(LightNormal);

  return (
    <button
      type="button"
      onClick={signInWithPopup}
      onMouseDown={() => setGoogleButton(LightPressed)}
      onMouseUp={() => setGoogleButton(LightNormal)}
      onBlur={() => setGoogleButton(LightNormal)}
      className="bg-blue-500 border border-gray-100 flex items-center m-0 rounded text-white"
    >
      <GoogleButton style={{ pointerEvents: "none" }} />
      <span className="font-semibold ml-1.5 mr-2.5">Sign in with Google</span>
    </button>
  );
};

export default LoginButton;
