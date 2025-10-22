import { ReactSVG } from "react-svg";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaLinkedin,
    FaPinterest,
    FaGlobe,
    FaWhatsapp
} from "react-icons/fa";
import arattaiLogo from "../../public/assets/logo/arattaiLogo.svg";


const ArattaiIcon = () => <ReactSVG src={arattaiLogo} beforeInjection={(svg) =>
    svg.setAttribute("class", "d-inherit w-7 h-7")} className="svg-injector icon" />;

const socialPlatforms = [
    { name: "Arattai", icon: <ArattaiIcon /> },
    { name: "Facebook", icon: <FaFacebook /> },
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "LinkedIn", icon: <FaLinkedin /> },
    { name: "Twitter", icon: <FaTwitter /> },
    { name: "YouTube", icon: <FaYoutube /> },
    { name: "Pinterest", icon: <FaPinterest /> },
    { name: "Whatsapp", icon: <FaWhatsapp /> },
    { name: "Website", icon: <FaGlobe /> }
];

export default socialPlatforms;