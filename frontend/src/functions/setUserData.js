export function setUserData(userData, setData) {
    userData = [
        { label: 'Name', value: userData.name },
        { label: 'Address', value: userData.address },
        { label: 'Date of Birth', value: userData.dateOfBirth },
        { label: 'Id Number', value: userData.idNumber }
    ];
    userData = userData.filter(item => item.value);
    setData(userData);
}
