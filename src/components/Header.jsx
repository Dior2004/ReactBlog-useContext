import React from "react";
import {
  MdOutlinePhoneIphone,
  MdOutlineTabletMac,
  MdOutlineLaptopMac,
} from "react-icons/md";

const Header = ({ title, width }) => {
  return (
    <header>
      <div className="wrap">
        <div>
          <h1>React JS | {title}</h1>
        </div>
        <i>
          {width < 700 ? (
            <MdOutlinePhoneIphone />
          ) : width < 1000 ? (
            <MdOutlineTabletMac />
          ) : (
            <MdOutlineLaptopMac style={{ fontSize: 38, marginBottom: -5 }} />
          )}
        </i>
      </div>
    </header>
  );
};

export default Header;
