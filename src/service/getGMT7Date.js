function getGMT7Date() {
    const date = new Date();
    const utcOffset = date.getTimezoneOffset() * 60000;
    const gmt7Offset = 7 * 60 * 60000;
    const gmt7Date = new Date(date.getTime() + utcOffset + gmt7Offset);
    
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    
    const formattedDate = gmt7Date.toLocaleString('en-GB', options).replace(',', '');
    
    return formattedDate;
}

module.exports = getGMT7Date;