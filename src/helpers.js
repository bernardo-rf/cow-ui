export function toDateTime(timestamp) {
    return timestamp.substring(0, 16).replace('T', ' ')
}

export function toDate(timestamp) {
    return timestamp.replace('T', ' ').split(" ")[0]
}

export function toNewDate(timestamp){
    return new Date(timestamp.split(" ")[0])
}