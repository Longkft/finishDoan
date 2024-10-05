const commonJS = {
    /**
     * Format ngày tháng thành định dạng dd/mm/yyyy
     * CreatedBy: huynq 10/12/2022
     * @param {*} dateTime
     * @returns
     */
    formatDate(dateTime) {
        try {
            if (dateTime != null && dateTime != undefined) {
                //Chuyển thành dữ liệu ngày tháng
                dateTime = new Date(dateTime);

                let date = dateTime.getDate();
                date = date < 10 ? `0${date}` : date;

                let month = dateTime.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;

                let year = dateTime.getFullYear();

                return `${date}/${month}/${year}`;
            } else {
                return '';
            }
        } catch (err) {
            return '';
        }
    },

    /**
     * Format ngày tháng thành định dạng dd/mm/yyyy và thời gian thành định dạng hh:mm:ss
     * CreatedBy: huynq 10/12/2022
     * @param {*} dateTime
     * @returns
     */
    formatDateTime(dateTime) {
        try {
            if (dateTime != null && dateTime != undefined) {
                // Chuyển thành dữ liệu ngày tháng
                dateTime = new Date(dateTime);

                let date = dateTime.getDate();
                date = date < 10 ? `0${date}` : date;

                let month = dateTime.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;

                let year = dateTime.getFullYear();

                let hours = dateTime.getHours();
                hours = hours < 10 ? `0${hours}` : hours;

                let minutes = dateTime.getMinutes();
                minutes = minutes < 10 ? `0${minutes}` : minutes;

                let seconds = dateTime.getSeconds();
                seconds = seconds < 10 ? `0${seconds}` : seconds;

                return `${date}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
            } else {
                return '';
            }
        } catch (err) {
            return '';
        }
    },

    /**
     * Format ObjectId mongodb thành định dạng dd/mm/yyyy và thời gian thành định dạng hh:mm:ss
     * CreatedBy: huynq 10/12/2022
     * @param {*} dateTime
     * @returns
     */
    formatDateTimeFromObjectId(objectId) {
        try {
            if (objectId != null && objectId != undefined) {
                const date = new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
                return date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
            } else {
                return '';
            }
        } catch (err) {
            return '';
        }
    },

    /**
     * Format ngày tháng thành định dạng yyyy-mm-dd
     * CreatedBy: huynq 10/12/2022
     * @param {*} dateTime
     * @returns
     */
    bindingFormatDate(dateTime) {
        try {
            if (dateTime != null && dateTime != undefined) {
                //Chuyển thành dữ liệu ngày tháng
                dateTime = new Date(dateTime);

                let date = dateTime.getDate();
                date = date < 10 ? `0${date}` : date;

                let month = dateTime.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;

                let year = dateTime.getFullYear();

                if (isNaN(Date.parse(dateTime)) == true) {
                    return '';
                } else return `${year}-${month}-${date}`;
            } else {
                return '';
            }
        } catch (err) {
            return '';
        }
    },

    /**
     * Format tiền thành định dạng 0đ
     * CreatedBy: huynq 10/12/2022
     * @param {*} number
     * @returns
     */
    formatCurrency(number) {
        try {
            if (number != null || number != undefined) {
                // return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
                return new Intl.NumberFormat({ style: 'currency' }).format(number);
            }
            return '';
        } catch (err) {
            return '';
        }
    },
    /**
     * Format tiền thành định dạng 0đ
     * CreatedBy: huynq 10/12/2022
     * @param {*} number
     * @returns
     */
    formatCurrencyCorrect(number) {
        try {
            if (number != null || number != undefined) {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
                // return new Intl.NumberFormat({ style: 'currency' }).format(number);
            }
            return '';
        } catch (err) {
            return '';
        }
    },

    /**
     * Format giới tính thành định dạng Nam/Nữ/Khác
     * CreatedBy: huynq 10/12/2022
     * @param {*} gender
     * @returns
     */
    formatGender(gender) {
        try {
            if (gender == 1) {
                return 'Nữ';
            } else if (gender == 0) {
                return 'Nam';
            } else return 'Khác';
        } catch (err) {
            return '';
        }
    },

    /**
     * Format trạng thái thành định dạng online/offline
     * CreatedBy: huynq 10/12/2022
     * @param {*} status
     * @returns
     */
    formatStatus(status) {
        try {
            if (status == 1) {
                return 'Đã xác thực';
            } else return 'Chưa xác thực';
        } catch (err) {
            return '';
        }
    },

    formatResultPlay(result) {
        try {
            // if (status == 1) {
            //     return 'Đã xác thực';
            // } else return 'Chưa xác thực';
            if (result == 2) {
                return 'Win';
            } else if (result == 1) {
                return 'Lose';
            } else if (result == 0) {
                return 'Draw';
            }
        } catch (err) {
            return '';
        }
    },

    formatFriendGame(result) {
        try {
            if (result == 1) {
                return 'Facebook';
            } else if (result == 2) {
                return 'Game';
            } else if (result == 3) {
                return 'Nope';
            }
        } catch (err) {
            return '';
        }
    },

    formatModePlayGame(result) {
        try {
            if (result == 0) {
                return 'Standard';
            } else if (result == 2) {
                return 'Blitz';
            } else if (result == 1) {
                return 'Tournament';
            }
        } catch (err) {
            console.error(err);

            return '';
        }
    },

    formatLogicBotGame(result) {
        try {
            if (result == 0) {
                return 'Monte carlo tree search';
            } else if (result == 1) {
                return 'Alpha go 1300 elo';
            } else if (result == 2) {
                return 'Alpha go 1400 elo';
            } else if (result == 3) {
                return 'Alpha go 1800 elo';
            }
        } catch (err) {
            return '';
        }
    },
};

export default commonJS;
