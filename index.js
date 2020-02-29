var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
System.register("client", [], function (exports_1, context_1) {
    "use strict";
    var methodShouldUseBody, createUrl, createFetchClient;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            methodShouldUseBody = function (verb) { return verb === 'POST'
                || verb === 'PUT'
                || verb === 'PATCH'
                || verb === 'DELETE'; };
            createUrl = function (ri, query) {
                var url = new URL(ri.join('/')
                    .toString()
                    .replace(/([^:])[\\/]+/g, '$1/'));
                if (query) {
                    Object.keys(query).forEach(function (key) { return url.searchParams.append(key, query[key]); });
                }
                return url;
            };
            /**
             * Creates a function with default behavior to wrap the fetch api.
             *
             * @param rootURL A string to prepend to all requests made with this client.
             * @param init A function that returns initialization options for fetch(). Should be asynchronous.
             * @param middleware A function that runs on the response body every time the client is used to make a request. Should be asynchronous.
             */
            createFetchClient = function (rootURL, init, middleware) {
                var r = rootURL || '';
                var i = init || (function (body) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ body: "" + body })];
                }); }); });
                var m = middleware || (function (res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, res];
                }); }); });
                return function (url, method, payload, options) { return __awaiter(void 0, void 0, void 0, function () {
                    var computedOptions, _a, requestInfo, requestInit, result;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!methodShouldUseBody(method)) return [3 /*break*/, 2];
                                return [4 /*yield*/, i(payload)];
                            case 1:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, i()];
                            case 3:
                                _a = _b.sent();
                                _b.label = 4;
                            case 4:
                                computedOptions = _a;
                                requestInfo = createUrl([r, url], methodShouldUseBody(method) ? payload : {}).href;
                                requestInit = __assign(__assign(__assign({}, computedOptions), options), { headers: __assign(__assign({}, computedOptions === null || computedOptions === void 0 ? void 0 : computedOptions.headers), options === null || options === void 0 ? void 0 : options.headers), method: method });
                                return [4 /*yield*/, fetch(requestInfo, requestInit)];
                            case 5:
                                result = _b.sent();
                                return [4 /*yield*/, m(result)];
                            case 6: return [2 /*return*/, _b.sent()];
                        }
                    });
                }); };
            };
            exports_1("default", createFetchClient);
        }
    };
});
System.register("index", ["client"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_2(exports);
    }
    return {
        setters: [
            function (client_1_1) {
                exportStar_1(client_1_1);
            }
        ],
        execute: function () {
        }
    };
});
