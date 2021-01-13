module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: {
        enabled: true,
        content: ["./src/**/*.{html,tsx}"]
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
}
