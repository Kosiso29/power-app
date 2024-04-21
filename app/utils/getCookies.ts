export function getCookieByNameEndsWith(suffix: string) {
    const cookies = document.cookie.split('; ');
    const suffixLength = suffix.length;

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const equalsIndex = cookie.indexOf('=');
        const name = cookie.substring(0, equalsIndex);
        const value = cookie.substring(equalsIndex + 1);

        // Check if the cookie name ends with the specified suffix
        if (name.endsWith(suffix)) {
            return value;
        }
    }

    return null; // Return null if no cookie found with the specified suffix
}