let uniqueId = 0;
export function getUniqueId() {
    return ++uniqueId;
}
export function setUniqueId(i) {
    uniqueId = i;
}
export function getId() {
    return uniqueId;
}