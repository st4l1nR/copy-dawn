const utils = {
  async selectVariant(productHandle) {
    const product = await (
      await fetch(window.Shopify.routes.root + `products/${productHandle}.js`)
    ).json();

    const selectedOptions = [];
    let count = 0;
    while (true) {
      count += 1;
      const element = document.getElementById(`option-${count}`);
      if (!element) break;
      const selectedOption = [...element.children].find(
        (child) => child.checked
      ).value;
      selectedOptions.push(selectedOption);
    }
    if (!selectedOptions[0]) return;

    const selectedVariant = product.variants.find(
      (variant) => variant.title == selectedOptions.join(" / ")
    );
    if (!selectedVariant) return;
    history.pushState({}, null, `${product.url}?variant=${selectedVariant.id}`);
    this.$dispatch("update-product", {
      query: "variant=" + selectedVariant.id,
    });
  },

  async addToCart(productForm) {
    try {
      const formData = new FormData(productForm);
      await fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        body: formData,
      });
      this.$dispatch("update-header")
      this.$dispatch("update-cart-drawer");
      this.$dispatch("toggle-cart");
    } catch (error) {
      console.error(error);
    }
  },
  async updateCartItem(id, quantity) {
    this.loading = true;
    try {
      await fetch(window.Shopify.routes.root + "cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          quantity,
        }),
      });
      this.$dispatch('update-header')
      this.$dispatch("update-cart-drawer");
      this.$dispatch("update-cart");
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  },
  getSectionId() {
    try {
      const sections = [
        ...document.body
          .querySelector("main")
          .querySelectorAll(".shopify-section"),
      ];
      const section = sections.find((section) => section.id.includes(name));
      return section.id.slice(section.id.indexOf("template"));
    } catch (error) {
      console.error(error);
    }
  },
  getSectionsId() {
    return [
      ...document.body
        .querySelector("main")
        .querySelectorAll(".shopify-section"),
    ].map((section) => section.id.slice(section.id.indexOf("template")));
  },
  async updateSections(path, query, sections_id, targets_id = []) {
    this.loading = true;
    try {
      const sections = await (
        await fetch(
          window.Shopify.routes.root +
            `${path}?sections=${sections_id.join()}&${query}`
        )
      ).json();
      const parser = new DOMParser();
      Object.entries(sections).forEach(([sectionId, sectionString], idx) => {
        const newSection = parser
          .parseFromString(sectionString, "text/html")
          .body.querySelector(`#shopify-section-${sectionId}`);
        const oldSection = document.body.querySelector(
          `#shopify-section-${sectionId}`
        );
        if (targets_id[idx]) {
          const newTarget = newSection.querySelector(targets_id[idx]);
          const oldTarget = oldSection.querySelector(targets_id[idx]);
          oldTarget.replaceWith(newTarget);
        } else oldSection.replaceWith(newSection);
      });
      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  },
  async updateView(path, query, view_id, target_id) {
    this.loading = true;
    try {
      console.log(
        window.Shopify.routes.root + `${path}?view=${view_id}&${query}`
      );
      const parser = new DOMParser();
      let newView = await (
        await fetch(
          window.Shopify.routes.root + `${path}?view=${view_id}&${query}`
        )
      ).text();
      newView = parser.parseFromString(newView, "text/html").body.firstChild;
      const oldView = document.body.querySelector(`#${target_id}`);
      oldView.replaceWith(newView);
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  },
  async predictSearch(query, resources) {
    this.loading = true
    try {
      let params = new URLSearchParams({ q: query });
      Object.entries(resources).forEach(([key, value]) => {
        if (typeof value == "object") {
          Object.entries(value).forEach(([key2, value2]) => {
            params.append(`resources[${key}][${key2}]`, `${value2}`);
          });
        } else params.append(`resources[${key}]`, `${value}`);
      });

      const response = await (
        await fetch(
          window.Shopify.routes.root +
            `search/suggest.json?${params.toString()}`
        )
      ).json();
      this.predictResults = response.resources.results;
    } catch (error) {
      console.error(error);
    }
    this.loading = false
  },
};
