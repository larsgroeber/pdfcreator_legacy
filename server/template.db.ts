import {TemplateModel} from "./models/template.model";
import {TemplateI} from "./interfaces/template";

export class TemplateDB {
  static getAll(callback: (err: any, templates: TemplateI[]) => void) {
    TemplateModel.find((err, templates) => {
      callback(err, templates);
    })
  }

  static getAllActive(callback: (err: any, templates: TemplateI[]) => void) {
    TemplateModel.find({active: true}, (err, templates) => {
      callback(err, templates);
    })
  }

  static getOne(name: string, callback: (err: any, template: TemplateI) => void) {
    TemplateModel.findOne({name: name}, (err, template) => {
      callback(err, template);
    })
  }

  static save(newTemplate: TemplateI, callback: (err: any, template: TemplateI) => void) {
    let newTemplateModel = new TemplateModel(newTemplate);
    newTemplateModel.save(err => {
      callback(err, newTemplateModel);
    })
  }

  static change(oldTemplate, callback: (err: any, template: TemplateI) => void) {
    TemplateModel.findOne({_id: oldTemplate._id}, (err, template) => {
      if (template) {
        template.name = oldTemplate.name;
        template.desc = oldTemplate.desc;
        template.active = oldTemplate.active;

        template.save(err => {
          callback(err, oldTemplate);
        })
      } else {
        callback('Could not find template!', undefined);
      }
    })
  }

  static remove(oldTemplate, callback: (err: any) => void) {
    TemplateModel.remove({_id: oldTemplate._id }, err => {
      callback(err);
    })
  }
}
