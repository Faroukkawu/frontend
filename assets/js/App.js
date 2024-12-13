const app = Vue.createApp({
    data() {
        return {
            search: "",
            person: {
                name: null,
                phone: null,
            },
            sitename: "CourseWork",
            filters: [
                { id: 1, name: "Subject", checked: true },
                { id: 2, name: "Location", checked: false },
                { id: 3, name: "Price", checked: false },
                { id: 4, name: "Availability", checked: false },
            ],
            secondary_filters: [
                { id: 1, name: "Ascending", sign: "", checked: true },
                { id: 2, name: "Descending", sign: "-", checked: false },
            ],
            lessons: [],
            cart: [],
            total: 0,
        };
    },

    methods: {
        // Fetch lessons from the backend
        async fetchLessons() {
            try {
                const apiUrl = "https://backend-5pcg.onrender.com/api/lessons";
                console.log("Fetching lessons from:", apiUrl);

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log("API Response Data:", data);

                // Check the data structure and assign it
                this.lessons = data;
            } catch (error) {
                console.error("Error fetching lessons:", error.message);
                alert("Failed to fetch lessons. Please try again later.");
            }
        },

        addToCart(course) {
            if (course.spaces > 0) {
                this.cart.push(course);
                this.total += course.price;
                course.spaces--;
            }
        },

        removeFromCart(course) {
            let index = this.cart.indexOf(course);
            this.cart.splice(index, 1);
            course.spaces++;
            this.total -= course.price;
        },

        resetVariable() {
            this.cart = [];
            this.total = 0;
        },

        checkout() {
            let msg = `Thanks ${this.person.name}, your total price is ₦${this.total} only.`;
            alert(msg);
            this.resetVariable();
        },

        applyFilter() {
            let sign = this.secondary_filters.find((obj) => obj.checked).sign;
            let filter = this.filters.find((obj) => obj.checked).name.toLowerCase();

            if (filter === "availability") {
                filter = "spaces";
            }

            this.lessons = this.lessons.sort(this.dynamicSort(sign + filter));
        },

        dynamicSort(property) {
            const sortOrder = property.startsWith("-") ? -1 : 1;
            const prop = property.startsWith("-") ? property.slice(1) : property;

            return (a, b) => {
                const result = a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;
                return result * sortOrder;
            };
        },

        toggleMainFilter(filter) {
            this.filters.forEach((e) => (e.checked = e === filter));
            this.applyFilter();
        },

        toggleSecondaryFilter(sfilter) {
            this.secondary_filters.forEach((e) => (e.checked = e === sfilter));
            this.applyFilter();
        },
    },

    mounted() {
        // Fetch lessons when the app is mounted
        this.fetchLessons();
    },
});

app.mount("#app");
