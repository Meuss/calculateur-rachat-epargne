<template>
  <div class="wrapper">
    <table>
      <tr>
        <td>Epargne annuelle</td>
        <td>
          <number-input
            v-model="epargne"
            :min="1000"
            :max="10000000"
            inline
            center
            small
          ></number-input>
        </td>
      </tr>
      <tr>
        <td>Taux marginal d'imposition</td>
        <td>
          <number-input
            v-model="taux"
            :min="1"
            :max="100"
            inline
            center
            small
          ></number-input>
        </td>
        <td>
          (Si votre revenu est supérieur à 150'000.- et que vous ignorez votre
          taux marginal, insérez 40%)
        </td>
      </tr>
      <tr>
        <td>Nombre d'années</td>
        <td>
          <number-input
            v-model="annees"
            :min="1"
            :max="15"
            inline
            center
            small
            rounded
          ></number-input>
        </td>
      </tr>
      <tr class="spacer">
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Gain fiscal annuel brut</td>
        <td>{{ gainfiscal }}</td>
      </tr>
      <tr>
        <td>Investissement effectif en tenant compte de l'AF</td>
        <td>{{ investissement }}</td>
      </tr>
      <tr>
        <td>Avantage fiscal</td>
        <td>{{ avantagefiscal }}</td>
        <td>Ce taux peut varier, la moyenne est cependant de 10%</td>
      </tr>
      <tr>
        <td>Capital final</td>
        <td>{{ capitalfinal }}</td>
      </tr>
      <tr>
        <td>Impôt sur le retrait 10%</td>
        <td>{{ impot }}</td>
      </tr>
      <tr>
        <td>Bénéfice final</td>
        <td>{{ benefice }}</td>
      </tr>
      <tr>
        <td>Gain fiscal total</td>
        <td>{{ gainfiscaltotal }}</td>
      </tr>
      <tr>
        <td>Gain fiscal annuel brut</td>
        <td>{{ gainfiscalbrut }}</td>
      </tr>
      <tr>
        <td>Rendement du placement</td>
        <td>{{ rendement }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  data() {
    return {
      epargne: 50000,
      taux: 36,
      annees: 3
    };
  },
  computed: {
    gainfiscal: function() {
      return parseFloat(((this.taux / 100) * this.epargne).toFixed(2));
    },
    investissement: function() {
      return this.epargne - this.gainfiscal;
    },
    avantagefiscal: function() {
      return this.gainfiscal * this.annees;
    },
    capitalfinal: function() {
      return this.epargne * this.annees;
    },
    impot: function() {
      return this.capitalfinal / 10;
    },
    benefice: function() {
      return this.capitalfinal - this.impot;
    },
    gainfiscaltotal: function() {
      return this.avantagefiscal - this.impot;
    },
    gainfiscalbrut: function() {
      return this.gainfiscaltotal / this.annees;
    },
    rendement: function() {
      return this.rate(
        this.annees,
        -this.investissement,
        0,
        this.benefice,
        0,
        0.1
      );
    }
  },
  methods: {
    rate(periods, payment, present, future, type, guess) {
      guess = guess === undefined ? 0.01 : guess;
      future = future === undefined ? 0 : future;
      type = type === undefined ? 0 : type;
      var epsMax = 1e-10;
      var iterMax = 10;
      var y,
        y0,
        y1,
        x0,
        x1 = 0,
        f = 0,
        i = 0;
      var rate = guess;
      if (Math.abs(rate) < epsMax) {
        y =
          present * (1 + periods * rate) +
          payment * (1 + rate * type) * periods +
          future;
      } else {
        f = Math.exp(periods * Math.log(1 + rate));
        y = present * f + payment * (1 / rate + type) * (f - 1) + future;
      }
      y0 = present + payment * periods + future;
      y1 = present * f + payment * (1 / rate + type) * (f - 1) + future;
      i = x0 = 0;
      x1 = rate;
      while (Math.abs(y0 - y1) > epsMax && i < iterMax) {
        rate = (y1 * x0 - y0 * x1) / (y1 - y0);
        x0 = x1;
        x1 = rate;
        if (Math.abs(rate) < epsMax) {
          y =
            present * (1 + periods * rate) +
            payment * (1 + rate * type) * periods +
            future;
        } else {
          f = Math.exp(periods * Math.log(1 + rate));
          y = present * f + payment * (1 / rate + type) * (f - 1) + future;
        }
        y0 = y1;
        y1 = y;
        ++i;
      }
      return parseFloat((rate * 100).toFixed(2));
    }
  }
};
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
input {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 100%;
  min-height: 1.5rem;
  min-width: 3rem;
  padding: 0.4375rem 0.875rem;
  transition: border-color 0.15s;
}
</style>
