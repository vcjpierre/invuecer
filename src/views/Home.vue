<template>
  <div class="home container">
    <!-- Header -->
    <div class="header flex">
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{ invoiceData.length }} total invoices</span>
      </div>
      <div class="right flex">
        <div @click="toggleFilterMenu" class="filter flex">
          <span
            >Filter by status <span v-if="filteredInvoice">: {{ filteredInvoice }}</span></span
          >
          <img src="@/assets/icon-arrow-down.svg" alt="" />
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filteredInvoices">Draft</li>
            <li @click="filteredInvoices">Pending</li>
            <li @click="filteredInvoices">Paid</li>
            <li @click="filteredInvoices">Clear Filter</li>
          </ul>
        </div>
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="" />
          </div>
          <span>New Invoice</span>
        </div>
      </div>
    </div>
    <!-- Invoices -->
    <div v-if="invoiceData.length > 0">
      <Invoice v-for="(invoice, index) in filteredData" :invoice="invoice" :key="index" />
    </div>
    <div v-else class="empty flex flex-column">
      <img src="@/assets/illustration-empty.svg" alt="" />
      <h3>There is nothing here</h3>
      <p>Create a new invoice by clicking the New Invoice button and get started</p>
    </div>
  </div>
</template>

<script>
import Invoice from "../components/Invoice";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      filterMenu: null,
      filteredInvoice: null,
    };
  },
  components: {
    Invoice,
  },
  methods: {
    ...mapMutations(["TOGGLE_INVOICE"]),
    newInvoice() {
      this.TOGGLE_INVOICE();
    },
    toggleFilterMenu() {
      this.filterMenu = !this.filterMenu;
    },
    filteredInvoices(e) {
      if (e.target.innerText === "Clear Filter") {
        this.filteredInvoice = null;
        return;
      }
      this.filteredInvoice = e.target.innerText;
    },
  },
  computed: {
    ...mapState(["invoiceData"]),
    filteredData() {
      return this.invoiceData.filter((invoice) => {
        if (this.filteredInvoice === "Draft") {
          return invoice.invoiceDraft === true;
        }
        if (this.filteredInvoice === "Pending") {
          return invoice.invoicePending === true;
        }
        if (this.filteredInvoice === "Paid") {
          return invoice.invoicePaid === true;
        }
        return invoice;
      });
    },
  },
};
</script>

<style lang="css" scoped>
.home {
  color: #fff;
}

.home .header {
  margin-bottom: 65px;
}

.home .header .left,
.home .header .right {
  flex: 1;
}

.home .header .right {
  justify-content: flex-end;
  align-items: center;
}

.home .header .right .button,
.home .header .right .filter {
  align-items: center;
}

.home .header .right .button span,
.home .header .right .filter span {
  font-size: 12px;
}

.home .header .right .filter {
  position: relative;
  margin-right: 40px;
  cursor: pointer;
}

.home .header .right .filter img {
  margin-left: 12px;
  width: 9px;
  height: 5px;
}

.home .header .right .filter .filter-menu {
  width: 120px;
  position: absolute;
  top: 25px;
  list-style: none;
  background-color: #1e2139;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.home .header .right .filter .filter-menu li {
  cursor: pointer;
  font-size: 12px;
  padding: 10px 20px;
}

.home .header .right .filter .filter-menu li:hover {
  color: #1e2139;
  background-color: #fff;
}

.home .header .right .button {
  padding: 8px 10px;
  background-color: #7c5dfa;
  border-radius: 40px;
}

.home .header .right .button .inner-button {
  margin-right: 8px;
  border-radius: 50%;
  padding: 8px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.home .header .right .button .inner-button img {
  width: 10px;
  height: 10px;
}

.home .empty {
  margin-top: 160px;
  align-items: center;
}

.home .empty img {
  width: 214px;
  height: 200px;
}

.home .empty h3 {
  font-size: 20px;
  margin-top: 40px;
}

.home .empty p {
  text-align: center;
  max-width: 224px;
  font-size: 12px;
  font-weight: 300;
  margin-top: 16px;
}
</style>