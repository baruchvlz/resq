module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest/globals": true
    },
    "parser": "babel-eslint",
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "jest"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-restricted-imports": [
            2,
            {
                "patterns": ["./../*"]
            }
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "max-len": [
            "error",
            {
                "code": 100,
                "tabWidth": 4
            }
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ]
    }
}
