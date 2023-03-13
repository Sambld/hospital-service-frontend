import { useEffect } from "react";

const About = () => {
    useEffect(() => {
        console.log('about is me')
    }, [])
    return ( 
        <div>
            <h1>About</h1>
            <p> this web site created by Youcef Hemadou</p>
        </div>
     );
}
 
export default About;