export const time_delta = (string_date) => {
    let date = new Date(string_date);
    let now = new Date();
    let delta = (now - date) / 1000;
    let ago = " secs ago";
    if (delta > 60) {
        delta /= 60;
        ago = " mins ago";
        if (delta > 60) {
            delta /= 60;
            ago = " hours ago";
            if (delta > 24) {
                delta /= 24;
                ago = " days ago";
            }
        }
    }
    delta = Math.round(delta, 2);
    return delta + ago;
};