const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const uglifyjs = require('uglify-js')

const { log } = console

const run = async () => {
    const distPath = path.join(__dirname, '..', 'dist')

    log('Building library')
    log('')

    try {
        child_process.execSync('npm run setup')

        const distContent = fs.readdirSync(distPath)
        log('')
        log('Uglifying files')
        distContent.forEach((file) => {
            const filePath = path.join(distPath, file)
            const index = fs.readFileSync(filePath, 'utf-8')
            const uglify = uglifyjs.minify(index, { mangle: false })

            setTimeout(() => {
                fs.writeFile(filePath, uglify.code, 'utf-8', err => {
                    if(err) {
                        log(err)
                        return
                    }

                    log(`File ${file} successfully uglified`)
                })
            }, 2000)
        })

    } catch (error) {
        throw new Error(error)
    } finally {

        log('')
        log('Done building')
    }
}

module.exports = run()
