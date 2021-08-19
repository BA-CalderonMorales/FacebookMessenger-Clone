import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../components/firebase';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Chats = () => {
    // const projectId = "7b9744d1-7ef5-40aa-a1ab-123b6c6bc2fe";
    // const key = "09684fad-edf2-401a-a590-86b6a3505414";
    const history = useHistory();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    console.log(user);

    const handleLogout = async () => {
        await auth.signOut();
        history.push("/")
    }

    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob(); // images that need to be transferred over in binary format.

        return new File([data], "userPhoto.jpg", {type: 'image/jpeg'});
    }

    useEffect(() => {
        if (!user) {
            history.push('/');
            return;
        }
        axios.get('https://api.chatengine.io/users/me', { 
            headers: {  
            "project-Id": "7b9744d1-7ef5-40aa-a1ab-123b6c6bc2fe",
            "user-name": user.email,
            "user-secret": user.uid
            } 
        })
        .then(() => { setLoading(false) })
        .catch(() => {
            let formData = new FormData();
            formData.append('email', user.email);
            formData.append('username', user.email);
            formData.append('secret', user.uid);

            getFile(user.photoURL)
                .then((avatar) => {
                formData.append('avatar', avatar, avatar.name);

                axios.post('https://api.chatengine.io/users/', 
                    formData,
                    { headers: { "private-key": "09684fad-edf2-401a-a590-86b6a3505414" } }
                )
                .then(() => setLoading(false))
                .catch((error) => console.log(error));
            })
        })
    }, [user, history])

    if (!user || loading) {
        return "Loading...";
    }

    return (  
        <div className="chats-page">
            <div className="nav-bar">
                <div className="logo-tab">
                    Chat With Mario
                </div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>

            <ChatEngine 
                height="calc(100vh - 66px)"
                projectID="7b9744d1-7ef5-40aa-a1ab-123b6c6bc2fe"
                userName={user.email}
                userSecret={user.uid}
            />

        </div>
    );
}
 
export default Chats;