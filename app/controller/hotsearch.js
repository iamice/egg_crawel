"use strict";

const { Controller } = require("egg");
const wuaipojie = require("../reptilehot/shequ/wuaipojie");

class HotSearchController extends Controller {
    async index() {
        const { ctx } = this;
        console.log(ctx.query);
        const dataList = await this.ctx.app.mysql.query("SELECT * FROM crawel WHERE MATCH(reptileName,title) AGAINST (? IN BOOLEAN MODE) order by id desc limit ?,20", [
            ctx.query.search,
            parseInt(ctx.query.page),
        ]);
        if (dataList.length === 0) {
            return this.getRepaName(ctx.query);
        } else {
            ctx.body = {
                code: 200,
                message: "success",
                data: dataList,
            };
        }
    }

    async testhot() {
        const { ctx } = this;
        const result = await wuaipojie(ctx);
        ctx.body = {
            code: 200,
            message: "success",
            data: result,
        };
    }

    async getRepaName(searchText) {
        const { ctx } = this;
        console.log(ctx.query);
        const search = ctx.query ? ctx.query.search : searchText.search;
        const page = ctx.query ? ctx.query.page : searchText.page;
        const dataList = await this.ctx.app.mysql.query("SELECT * FROM crawel WHERE reptileName like ? order by id desc limit ?,20", [`%${search}%`, page]);
        ctx.body = {
            code: 200,
            message: "success",
            data: dataList,
        };
    }
}

module.exports = HotSearchController;
