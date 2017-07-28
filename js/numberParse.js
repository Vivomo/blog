class Expression {
    constructor() {
        this.numberMap = {
            零: 0,
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
            九: 9
        };
    }

    parse (context) {
        let { data, str } = context;
        if (str.length == 0) {
            return;
        }
        
        Object.keys(this.numberMap).forEach((key) => {
            const value = this.numberMap[key];
            if (str.endsWith(key + this.getPostfix())) {
                data += value * this.multiplier();
                str = str.substring(0, str.length - this.getLength() - 1);
            }

            if (str.endsWith('零')) {
                str = str.substring(0, str.length - 1);
            }
        });
        context.str = str;
        context.data = data;
    }

    getPostfix() {}
    multiplier() {};
    getLength(){
        return this.getPostfix().length;
    }
}

class GeExpression extends Expression {
    getPostfix() {
        return '';
    }
    multiplier() {
        return 1;
    }
    getLength() {
        return 0;
    }
}

class ShiExpression extends Expression {
    getPostfix() {
        return '十';
    }
    multiplier() {
        return 10;
    }
}

class BaiExpression extends Expression {
    getPostfix() {
        return '百';
    }
    multiplier() {
        return 100;
    }
}

class QianExpression extends Expression {
    getPostfix() {
        return '千';
    }
    multiplier() {
        return 1000;
    }
}

class WanExpression extends Expression {
    getPostfix() {
        return '万';
    }
    multiplier() {
        return 10000;
    }

    parse(context) {
        let { data, str } = context;
        if (str.length == 0) {
            return;
        }
        const expressionList = [new GeExpression(), new ShiExpression(), new BaiExpression(), new QianExpression()];

        if (str.endsWith(this.getPostfix())) {
            context.str = str.substring(0, str.length - 1);
            context.data = 0;
            expressionList.forEach(expression => expression.parse(context));
            data += context.data * this.multiplier();
        }

        context.str = str;
        context.data = data;
    }
}

class Context {
    constructor(str) {
        this.str = str;
        this.data = 0;
    }

    toString() {
        return this.data.toString();
    }
}

(function main() {
    const context = new Context('八千零二万九千三百七十二');
    const expressionList = [new GeExpression(), new ShiExpression(), new BaiExpression(), new QianExpression(), new WanExpression()];
    expressionList.forEach(expression => expression.parse(context));
    console.log(context)
})();
