import  { useEffect, useState } from "react";
import {Link} from 'react-router-dom';

function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

console.log("messsage",message);
  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef} `);
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
    
  }, [listing.userRef]);



  return (
    <>
      {landlord && (
        <div className="flex flex-col">
          <p>
            Contact <span className=" font-semibold"> {landlord.username}</span>
            For {' '}<span className=" font-semibold">{listing.name}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows="2"
            value={message}
            onChange={handleOnChange}
            placeholder="Enter your message here"
            className=" w-full p-3 border rounded-lg"
          ></textarea>

        <Link
        to = {`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`}
        className = ' bg-slate-700 text-white p-3 border uppercase text-center rounded-lg hover:opacity-95'
        >
          Send Message
        </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
