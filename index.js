'use strict'

const _ = require('lodash')
const joi = require('joi')
const util = require('./util')

module.exports = class Trailpack {

  constructor (app, config) {
    _.extend(this, config.trailpack)

    delete config.trailpack
    _.defaultsDeep(app.config, config)

    this.app = app
    this.config = app.config
  }

  /**
   * Test the sanity of this trailpack.
   * @return Promise
   */
  test () {
    return new Promise((resolve, reject) => {
      joi.validate(this.config, util.trailpackSchema, (err, value) => {
        if (err) return reject(err)

        return resolve(value)
      })
    })
  }

  /**
   * Validate any necessary preconditions for this trailpack. 
   * @return Promise
   */
  validate () {
    return this.app.after('trailpack:core:validated')
  }

  /**
   * Set any configuration required before the trailpacks are initialized.
   */
  configure () {
    return this.app.after('trailpack:core:configured')
  }

  /**
   * Start any services or listeners necessary for this pack
   */
  initialize () {
    return this.app.after('trailpack:core:initialized')
  }
}
