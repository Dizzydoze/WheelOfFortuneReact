import axios from "axios";

/**
 * User component
 * @constructor
 */
function User({userId, userName, setUserName}) {

    const serverUrl = "https://gameserver-406503.wl.r.appspot.com"

    /**
     * save current userName related to the userId
     */
    function saveUser(){

        const userPostUrl = `${serverUrl}/saveUser`

        const userPostData = {
            userId,
            userName
        }

        axios.post(userPostUrl, userPostData)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.error('Error posting data:', error);
            })
    }

    // search current userName related to current userId, if it doesn't exist, save new userName
    function updateUser(event) {
        // KEY! this prevents the whole page being reloaded everytime we submit the form
        event.preventDefault();
        const userFindPostUrl = `${serverUrl}/findAllUserName`
        const userFindPostData = {userId: userId}
        axios.post(userFindPostUrl, userFindPostData)
            .then(response => {
                console.log(response.data);
                // userName is new, save it to DB
                const savedNames = response.data.map(obj => obj.userName)
                if (!savedNames.includes(userName)){
                    saveUser()
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className='user'>
            <form onSubmit={updateUser}>
                <label>
                    My Name:
                    <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                </label>
                <button className='button' type="submit">Set</button>
            </form>
            <h3>[{userId.substring(userId.length - 5, userId.length - 1)}] {userName} is playing</h3>
        </div>
    )
}

export default User;