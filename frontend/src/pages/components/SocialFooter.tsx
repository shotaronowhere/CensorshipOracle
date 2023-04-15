// components/SocialsFooter.tsx

import React from "react";
import { FaGithub } from "react-icons/fa";

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      {icon}
    </a>
  );
};

const SocialsFooter: React.FC = () => {
  return (
    <footer className="bg-white py-4 border-t border-gray-200">
       <div className="text-xs text-slate-500">
        Made with ❤️ at ETH Tokyo
      </div>
      <br></br>  
      <div className="container mx-auto flex justify-center space-x-6">
        <SocialIcon href="https://github.com/shotaronowhere/CensorshipOracle" icon={<FaGithub />} />
      </div>
    </footer>
  );
};

export default SocialsFooter;
