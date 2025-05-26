import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '@/public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

export const upload = multer({storage: storage})

//diskStorage in multer is an object of methods: destination and filename are methods
//destination saves the uploaded file in local storage
//filename changes the name of the file