export function toDateTime(timestamp) {
    return timestamp.substring(0, 16).replace('T', ' ')
}

export function toDate(timestamp) {
    return timestamp.replace('T', ' ').split(" ")[0]
}