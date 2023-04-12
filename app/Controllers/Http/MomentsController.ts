import { v4 as uuidv4 } from 'uuid'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//import Moment from 'App/Models/Moment'
import Momento from 'App/Models/Momento'
import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  private validationOption = {
    types: ['image'],
    size: '2mb',
  }
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOption)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Momento.create(body)

    response.status(201)

    return {
      message: 'Momento criado com sucesso',
      data: moment,
    }
  }

  //Faz GET de todos registros
  public async index() {
    const moments = await Momento.all()

    return {
      data: moments,
    }
  }

  //Get por ID
  public async show({ params }: HttpContextContract) {
    const moment = await Momento.findOrFail(params.id)

    return {
      data: moment,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Momento.findOrFail(params.id)

    await moment.delete()

    return {
      message: 'Registro deletado com seucesso',
      data: moment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const moment = await Momento.findOrFail(params.id)

    moment.title = body.title
    // eslint-disable-next-line no-self-assign
    moment.description = body.description

    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validationOption)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moment.image = imageName
      }
    }

    await moment.save()

    return {
      message: 'Momento atualizado com sucesso',
      data: moment,
    }
  }
}
