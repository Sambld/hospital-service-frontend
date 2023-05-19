import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const About = () => {
    const { t:T,i18n } = useTranslation();
    return ( 
        <div>
            <h1>{T('about.title')}</h1>
            <p>{T('about.content')}</p>
        </div>
     );
}
 
export default About;