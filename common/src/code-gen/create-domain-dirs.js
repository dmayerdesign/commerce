const { resolve } = require('path')
const { readdirSync, mkdirSync, moveSync, statSync, readFileSync, writeFileSync } = require('fs-extra')

const pathsToWalk = [
  resolve(__dirname, '../../../common'),
  resolve(__dirname, '../../../server'),
  resolve(__dirname, '../../../ui'),
]
const importSubstrings = [
  'api/entities/',
  'api/interfaces/',
]

const walk = function(dir) {
  return new Promise((resolve) => {
    const list = readdirSync(dir)
    let results = [];
    let i = 0;
    (async function next() {
      let file = list[i++];
      if (!file) return resolve(results);
      file = dir + '/' + file;
      const stat = statSync(file)
      if (stat && stat.isDirectory()) {
        const res = await walk(file)
        results = results.concat(res);
        next();
      } else {
        results.push(file);
        next();
      }
    })();
  })
};
const pathToEntities = resolve(__dirname, '../lib/api/entities')
const pathToInterfaces = resolve(__dirname, '../lib/api/interfaces')
const pathToDomains = resolve(__dirname, '../lib/domains')
const importForDomains = '@qb/common/domains/'
const items = readdirSync(pathToEntities)
const nameObjects = items.map((item) => ({
  name: item.substring(0, item.lastIndexOf('.ts')),
  extension: '.ts'
}))

async function main() {
  nameObjects.forEach(({ name, extension }) => {
    try {
      mkdirSync(
        resolve(pathToDomains, name),
      )
    } catch (e) {
      console.warn(`${resolve(pathToDomains, name)} exists, skipping mkdir`)
    }
    moveSync(
      resolve(pathToEntities, name + extension),
      resolve(pathToDomains, name, name + extension),
    )
    moveSync(
      resolve(pathToInterfaces, name + extension),
      resolve(pathToDomains, name, name + '.interface' + extension),
    )
  })

  pathsToWalk.forEach((pathToWalk) => {
    importSubstrings.forEach((originalImportSubstr) => {
      walk(pathToWalk).then((paths) => {
        paths.forEach((filePath) => {
          let findStr = originalImportSubstr
          let destSuffix = ''
    
          if (findStr.indexOf('/interfaces/') > -1) {
            destSuffix = '.interface'
          }
    
          if (filePath.indexOf('common/src') > -1) {
            for (let i = 0; i < 10; i++) {
              if (findStr.indexOf('../') === -1) {
                findStr = '\'../' + findStr
              } else {
                findStr = '../' + findStr
              }
              doRename(findStr)
            }
          } else {
            findStr = '@qb/common/' + findStr
            doRename(findStr)
          }
            
          function doRename(findStr) {
            if (filePath.match(/\.ts$/)) {
              let fileContents = readFileSync(filePath).toString('utf-8')
              const indexOfFirstEntityImport = fileContents.indexOf(findStr)
              if (indexOfFirstEntityImport > -1) {
                const entityImports = fileContents.match(
                  new RegExp(`(?<=${findStr.substring(1)})[a-z\\-]+(?!\\.ts)`, 'g')
                )
      
                if (entityImports) {
                  entityImports.forEach((entityName) => {
                    console.log('entity import:', entityName)
                    fileContents = fileContents.replace(
                      new RegExp(findStr + entityName + `'`, 'g'),
                      `${importForDomains}${entityName}/${entityName}${destSuffix}'`
                    )
                    fileContents = fileContents.replace(/\'\'/g, `'`)
                  })
                }
    
                entityImports.forEach((entityImport) => {
                  console.log(entityImport)
                  console.log('write', filePath)
                  console.log(fileContents)
                  writeFileSync(
                    filePath,
                    fileContents,
                  )
                })
              }
            }
          }
    
        })
      })
    })
  })
}

main()