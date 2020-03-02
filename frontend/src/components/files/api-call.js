import axios from 'axios'

export const getFileList = () => {
    return axios({
        method: 'GET',
        url: "http://localhost:8081/file/list"
    })
    .then(res => {
        return res
    })
    .catch(err => {
        return err.response
    })
}

export const fileEdit = (file) => {
    return axios({
        method: 'GET',
        url: "http://localhost:8081/file/"+ file.id +"/content"
    })
    .then(res => {
        return res
    })
    .catch(err => {
        return err.response
    })
}

export const fileUpload = (file, description) => {
    const multipartFile = new FormData() 
    multipartFile.append('textfile', file)
    multipartFile.append('description', description)

    return axios({
        method: 'POST',
        url: "http://localhost:8081/file/upload",
        data: multipartFile,
        headers: {
            contentType: 'multipart/form-data'
        }
    })
    .then(res => {
        return res
    })
    .catch(err => {
        return err.response
    })
}

export const fileSave = (file_id, file_name, file_title, file_content) => {

    return axios({
        method: 'POST',
        url: "http://localhost:8081/file/save",
        data: {
            file_id: file_id,
            file_name: file_name,
            file_title: file_title,
            file_content: file_content
        },
        headers: {
            contentType: 'application/x-www-form-urlencoded'
        }
    })
    .then(res => {
        return res
    })
    .catch(err => {
        return err.response
    })
}

export const fileSearch = (file_name) => {

    return axios({
        method: 'POST',
        url: "http://localhost:8081/file/search",
        data: {
            name: file_name
        },
        headers: {
            contentType: 'application/x-www-form-urlencoded'
        }
    })
    .then(res => {
        return res
    })
    .catch(err => {
        return err.response
    })
}