/**Modulo que proporciona una sintaxis personalizada para el motor
 * de plantillas handlebars
 *
 *
 * @todo
 *
 *
 *
 * @author Neyder Figueroa
 * @author Andrés Llinás
 * @since 2020 Universidad del Quindío
 * @copyright Todos los derechos reservados
 *
 */

module.exports = {
  when: function (operand_1, operator, operand_2, options) {
    var operators = {
        eq: function (l, r) {
          return l == r;
        },
        noteq: function (l, r) {
          return l != r;
        },
        gt: function (l, r) {
          return Number(l) > Number(r);
        },
        or: function (l, r) {
          return l || r;
        },
        and: function (l, r) {
          return l && r;
        },
        "%": function (l, r) {
          return l % r === 0;
        },
      },
      result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
  },
  times: function (n, block) {
    accum = "";
    for (var i = 0; i < n; i++) {
      accum += block.fn(i);
    }
    return accum;
  },
  for: function (init, end, incr, block) {
    accum = "";
    for (var i = init; i < end; i += incr) {
      accum += block.fn(i);
    }
    return accum;
  },
};
