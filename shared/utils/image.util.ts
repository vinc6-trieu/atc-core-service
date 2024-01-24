import sharp from 'sharp'
import fs from 'fs'

interface ResizeOptions {
  device?: DEVICE_IMAGE_SIZE
  quality?: number
}

export const enum DEVICE_IMAGE_SIZE {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  OTHER = 'OTHER',
}

const DEVICE_IMAGE_SIZE_MAP = {
  DESKTOP: 700,
  MOBILE: 300,
  TABLET: 600,
  OTHER: 500,
}

const resizeForSEO = async (
  inputPath: string,
  device: DEVICE_IMAGE_SIZE = DEVICE_IMAGE_SIZE.DESKTOP,
  quality: number = 90,
  outDir: string = '',
) => {
  const RegexRemoveFileOriginalPath = /((.*\\)|(.*\/))/gi
  const imageWidth: number = DEVICE_IMAGE_SIZE_MAP[device] ?? 500

  console.log('Resize image to: ' + imageWidth)
  const originFile = sharp(inputPath)

  let newFileName = inputPath.replace(RegexRemoveFileOriginalPath, '')

  newFileName = (outDir ? outDir + '/' : '') + newFileName

  const info = await originFile.metadata().then((res) => res)

  const resizeWidth = info.width! >= imageWidth ? imageWidth : info.width
  try {
    originFile
      .resize({
        width: +resizeWidth!,
      })
      .toFile(`${newFileName}`, (err) => {
        if (err) console.error('CANNOT CREATE FILE : ' + newFileName + ' ! xxx\n', err)
        else console.log('--- CREATE FILE "' + newFileName + '" SUCCESSFULLY ! ---')
      })

    if (info.width! >= imageWidth)
      console.warn(
        `xxxxxxx Image ${inputPath.replace(RegexRemoveFileOriginalPath, '')} is too small ! xxxxxx`,
      )
  } catch (err) {
    console.log(err)
    return false
  }

  return true
}

export async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ResizeOptions = {},
): Promise<void> {
  const { quality = 90, device = DEVICE_IMAGE_SIZE.DESKTOP } = options

  try {
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }

    if (RegExp(/(\.(png|jpg|webp|svg|jpeg))$/i).exec(inputPath)) {
      resizeForSEO(inputPath, device, quality, outputPath)
      console.log(`Image resized successfully: ${outputPath}`)
    }
  } catch (error) {
    console.error(`Error resizing image: ${error}`)
  }
}
