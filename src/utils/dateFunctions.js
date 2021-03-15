const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
exports.FullDateString = async (date) => {
    let dateString = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    return dateString;
}


// usage RandomDate(new Date(2012, 0, 1), new Date())
exports.RandomDate = async (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

exports.getPastDate = async(years, months) => {
    let dateNow = await new Date();
    return new Date(dateNow.getFullYear() - years, (12 + dateNow.getMonth() - months)%12, 1);
}