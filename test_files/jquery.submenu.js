if (typeof GVAR == "undefined" || !GVAR) {
    var GVAR = {}
}
GVAR.namespace = function () {
    var A = arguments,
        E = null,
        C, B, D;
    for (C = 0; C < A.length; C = C + 1) {
        D = A[C].split(".");
        E = GVAR;
        for (B = (D[0] == "GVAR") ? 1 : 0; B < D.length; B = B + 1) {
            E[D[B]] = E[D[B]] || {};
            E = E[D[B]]
        }
    }
    return E
};
GVAR.log = function (D, A, C) {
    var B = GVAR.widget.Logger;
    if (B && B.log) {
        return B.log(D, A, C)
    } else {
        return false
    }
};
GVAR.register = function (A, E, D) {
    var I = GVAR.env.modules;
    if (!I[A]) {
        I[A] = {
            versions: [],
            builds: []
        }
    }
    var B = I[A],
        H = D.version,
        G = D.build,
        F = GVAR.env.listeners;
    B.name = A;
    B.version = H;
    B.build = G;
    B.versions.push(H);
    B.builds.push(G);
    B.mainClass = E;
    for (var C = 0; C < F.length; C = C + 1) {
        F[C](B)
    }
    if (E) {
        E.VERSION = H;
        E.BUILD = G
    } else {
        GVAR.log("mainClass is undefined for module " + A, "warn")
    }
};
GVAR.env = GVAR.env || {
    modules: [],
    listeners: []
};
GVAR.env.getVersion = function (A) {
    return GVAR.env.modules[A] || null
};
GVAR.env.ua = function () {
    var C = {
        ie: 0,
        opera: 0,
        gecko: 0,
        webkit: 0,
        mobile: null,
        air: 0
    };
    var B = navigator.userAgent,
        A;
    if ((/KHTML/).test(B)) {
        C.webkit = 1
    }
    A = B.match(/AppleWebKit\/([^\s]*)/);
    if (A && A[1]) {
        C.webkit = parseFloat(A[1]);
        if (/ Mobile\//.test(B)) {
            C.mobile = "Apple"
        } else {
            A = B.match(/NokiaN[^\/]*/);
            if (A) {
                C.mobile = A[0]
            }
        }
        A = B.match(/AdobeAIR\/([^\s]*)/);
        if (A) {
            C.air = A[0]
        }
    }
    if (!C.webkit) {
        A = B.match(/Opera[\s\/]([^\s]*)/);
        if (A && A[1]) {
            C.opera = parseFloat(A[1]);
            A = B.match(/Opera Mini[^;]*/);
            if (A) {
                C.mobile = A[0]
            }
        } else {
            A = B.match(/MSIE\s([^;]*)/);
            if (A && A[1]) {
                C.ie = parseFloat(A[1])
            } else {
                A = B.match(/Gecko\/([^\s]*)/);
                if (A) {
                    C.gecko = 1;
                    A = B.match(/rv:([^\s\)]*)/);
                    if (A && A[1]) {
                        C.gecko = parseFloat(A[1])
                    }
                }
            }
        }
    }
    return C
}();
(function () {
    GVAR.namespace("util", "widget", "example");
    if ("undefined" !== typeof GVAR_config) {
        var B = GVAR_config.listener,
            A = GVAR.env.listeners,
            D = true,
            C;
        if (B) {
            for (C = 0; C < A.length; C = C + 1) {
                if (A[C] == B) {
                    D = false;
                    break
                }
            }
            if (D) {
                A.push(B)
            }
        }
    }
})();
GVAR.lang = GVAR.lang || {};
(function () {
    var A = GVAR.lang,
        C = ["toString", "valueOf"],
        B = {
            isArray: function (D) {
                if (D) {
                    return A.isNumber(D.length) && A.isFunction(D.splice)
                }
                return false
            },
            isBoolean: function (D) {
                return typeof D === "boolean"
            },
            isFunction: function (D) {
                return typeof D === "function"
            },
            isNull: function (D) {
                return D === null
            },
            isNumber: function (D) {
                return typeof D === "number" && isFinite(D)
            },
            isObject: function (D) {
                return (D && (typeof D === "object" || A.isFunction(D))) || false
            },
            isString: function (D) {
                return typeof D === "string"
            },
            isUndefined: function (D) {
                return typeof D === "undefined"
            },
            _IEEnumFix: (GVAR.env.ua.ie) ?
            function (F, E) {
                for (var D = 0; D < C.length; D = D + 1) {
                    var H = C[D],
                        G = E[H];
                    if (A.isFunction(G) && G != Object.prototype[H]) {
                        F[H] = G
                    }
                }
            } : function () {},
            extend: function (H, I, G) {
                if (!I || !H) {
                    throw new Error("extend failed, please check that all dependencies are included.")
                }
                var E = function () {};
                E.prototype = I.prototype;
                H.prototype = new E();
                H.prototype.constructor = H;
                H.superclass = I.prototype;
                if (I.prototype.constructor == Object.prototype.constructor) {
                    I.prototype.constructor = I
                }
                if (G) {
                    for (var D in G) {
                        if (A.hasOwnProperty(G, D)) {
                            H.prototype[D] = G[D]
                        }
                    }
                    A._IEEnumFix(H.prototype, G)
                }
            },
            augmentObject: function (H, G) {
                if (!G || !H) {
                    throw new Error("Absorb failed, verify dependencies.")
                }
                var D = arguments,
                    F, I, E = D[2];
                if (E && E !== true) {
                    for (F = 2; F < D.length; F = F + 1) {
                        H[D[F]] = G[D[F]]
                    }
                } else {
                    for (I in G) {
                        if (E || !(I in H)) {
                            H[I] = G[I]
                        }
                    }
                    A._IEEnumFix(H, G)
                }
            },
            augmentProto: function (G, F) {
                if (!F || !G) {
                    throw new Error("Augment failed, verify dependencies.")
                }
                var D = [G.prototype, F.prototype];
                for (var E = 2; E < arguments.length; E = E + 1) {
                    D.push(arguments[E])
                }
                A.augmentObject.apply(this, D)
            },
            dump: function (D, I) {
                var F, H, K = [],
                    L = "{...}",
                    E = "f(){...}",
                    J = ", ",
                    G = " => ";
                if (!A.isObject(D)) {
                    return D + ""
                } else {
                    if (D instanceof Date || ("nodeType" in D && "tagName" in D)) {
                        return D
                    } else {
                        if (A.isFunction(D)) {
                            return E
                        }
                    }
                }
                I = (A.isNumber(I)) ? I : 3;
                if (A.isArray(D)) {
                    K.push("[");
                    for (F = 0, H = D.length; F < H; F = F + 1) {
                        if (A.isObject(D[F])) {
                            K.push((I > 0) ? A.dump(D[F], I - 1) : L)
                        } else {
                            K.push(D[F])
                        }
                        K.push(J)
                    }
                    if (K.length > 1) {
                        K.pop()
                    }
                    K.push("]")
                } else {
                    K.push("{");
                    for (F in D) {
                        if (A.hasOwnProperty(D, F)) {
                            K.push(F + G);
                            if (A.isObject(D[F])) {
                                K.push((I > 0) ? A.dump(D[F], I - 1) : L)
                            } else {
                                K.push(D[F])
                            }
                            K.push(J)
                        }
                    }
                    if (K.length > 1) {
                        K.pop()
                    }
                    K.push("}")
                }
                return K.join("")
            },
            substitute: function (S, E, L) {
                var I, H, G, O, P, R, N = [],
                    F, J = "dump",
                    M = " ",
                    D = "{",
                    Q = "}";
                for (;;) {
                    I = S.lastIndexOf(D);
                    if (I < 0) {
                        break
                    }
                    H = S.indexOf(Q, I);
                    if (I + 1 >= H) {
                        break
                    }
                    F = S.substring(I + 1, H);
                    O = F;
                    R = null;
                    G = O.indexOf(M);
                    if (G > -1) {
                        R = O.substring(G + 1);
                        O = O.substring(0, G)
                    }
                    P = E[O];
                    if (L) {
                        P = L(O, P, R)
                    }
                    if (A.isObject(P)) {
                        if (A.isArray(P)) {
                            P = A.dump(P, parseInt(R, 10))
                        } else {
                            R = R || "";
                            var K = R.indexOf(J);
                            if (K > -1) {
                                R = R.substring(4)
                            }
                            if (P.toString === Object.prototype.toString || K > -1) {
                                P = A.dump(P, parseInt(R, 10))
                            } else {
                                P = P.toString()
                            }
                        }
                    } else {
                        if (!A.isString(P) && !A.isNumber(P)) {
                            P = "~-" + N.length + "-~";
                            N[N.length] = F
                        }
                    }
                    S = S.substring(0, I) + P + S.substring(H + 1)
                }
                for (I = N.length - 1; I >= 0; I = I - 1) {
                    S = S.replace(new RegExp("~-" + I + "-~"), "{" + N[I] + "}", "g")
                }
                return S
            },
            trim: function (D) {
                try {
                    return D.replace(/^\s+|\s+$/g, "")
                } catch (E) {
                    return D
                }
            },
            merge: function () {
                var G = {},
                    E = arguments;
                for (var F = 0, D = E.length; F < D; F = F + 1) {
                    A.augmentObject(G, E[F], true)
                }
                return G
            },
            later: function (K, E, L, G, H) {
                K = K || 0;
                E = E || {};
                var F = L,
                    J = G,
                    I, D;
                if (A.isString(L)) {
                    F = E[L]
                }
                if (!F) {
                    throw new TypeError("method undefined")
                }
                if (!A.isArray(J)) {
                    J = [G]
                }
                I = function () {
                    F.apply(E, J)
                };
                D = (H) ? setInterval(I, K) : setTimeout(I, K);
                return {
                    interval: H,
                    cancel: function () {
                        if (this.interval) {
                            clearInterval(D)
                        } else {
                            clearTimeout(D)
                        }
                    }
                }
            },
            isValue: function (D) {
                return (A.isObject(D) || A.isString(D) || A.isNumber(D) || A.isBoolean(D))
            }
        };
    A.hasOwnProperty = (Object.prototype.hasOwnProperty) ?
    function (D, E) {
        return D && D.hasOwnProperty(E)
    } : function (D, E) {
        return !A.isUndefined(D[E]) && D.constructor.prototype[E] !== D[E]
    };
    B.augmentObject(A, B, true);
    GVAR.util.Lang = A;
    A.augment = A.augmentProto;
    GVAR.augment = A.augmentProto;
    GVAR.extend = A.extend
})();
GVAR.register("GVAR", GVAR, {
    version: "2.5.2",
    build: "1076"
});
(function () {
    var B = GVAR.util,
        K, I, J = {},
        F = {},
        M = window.document;
    GVAR.env._id_counter = GVAR.env._id_counter || 0;
    var C = GVAR.env.ua.opera,
        L = GVAR.env.ua.webkit,
        A = GVAR.env.ua.gecko,
        G = GVAR.env.ua.ie;
    var E = {
        HYPHEN: /(-[a-z])/i,
        ROOT_TAG: /^body|html$/i,
        OP_SCROLL: /^(?:inline|table-row)$/i
    };
    var N = function (P) {
        if (!E.HYPHEN.test(P)) {
            return P
        }
        if (J[P]) {
            return J[P]
        }
        var Q = P;
        while (E.HYPHEN.exec(Q)) {
            Q = Q.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase())
        }
        J[P] = Q;
        return Q
    };
    var O = function (Q) {
        var P = F[Q];
        if (!P) {
            P = new RegExp("(?:^|\\s+)" + Q + "(?:\\s+|$)");
            F[Q] = P
        }
        return P
    };
    if (M.defaultView && M.defaultView.getComputedStyle) {
        K = function (P, S) {
            var R = null;
            if (S == "float") {
                S = "cssFloat"
            }
            var Q = P.ownerDocument.defaultView.getComputedStyle(P, "");
            if (Q) {
                R = Q[N(S)]
            }
            return P.style[S] || R
        }
    } else {
        if (M.documentElement.currentStyle && G) {
            K = function (P, R) {
                switch (N(R)) {
                case "opacity":
                    var T = 100;
                    try {
                        T = P.filters["DXImageTransform.Microsoft.Alpha"].opacity
                    } catch (S) {
                        try {
                            T = P.filters("alpha").opacity
                        } catch (S) {}
                    }
                    return T / 100;
                case "float":
                    R = "styleFloat";
                default:
                    var Q = P.currentStyle ? P.currentStyle[R] : null;
                    return (P.style[R] || Q)
                }
            }
        } else {
            K = function (P, Q) {
                return P.style[Q]
            }
        }
    }
    if (G) {
        I = function (P, Q, R) {
            switch (Q) {
            case "opacity":
                if (GVAR.lang.isString(P.style.filter)) {
                    P.style.filter = "alpha(opacity=" + R * 100 + ")";
                    if (!P.currentStyle || !P.currentStyle.hasLayout) {
                        P.style.zoom = 1
                    }
                }
                break;
            case "float":
                Q = "styleFloat";
            default:
                P.style[Q] = R
            }
        }
    } else {
        I = function (P, Q, R) {
            if (Q == "float") {
                Q = "cssFloat"
            }
            P.style[Q] = R
        }
    }
    var D = function (P, Q) {
        return P && P.nodeType == 1 && (!Q || Q(P))
    };
    GVAR.util.Dom = {
        get: function (R) {
            if (R && (R.nodeType || R.item)) {
                return R
            }
            if (GVAR.lang.isString(R) || !R) {
                return M.getElementById(R)
            }
            if (R.length !== undefined) {
                var S = [];
                for (var Q = 0, P = R.length; Q < P; ++Q) {
                    S[S.length] = B.Dom.get(R[Q])
                }
                return S
            }
            return R
        },
        getStyle: function (P, R) {
            R = N(R);
            var Q = function (S) {
                return K(S, R)
            };
            return B.Dom.batch(P, Q, B.Dom, true)
        },
        setStyle: function (P, R, S) {
            R = N(R);
            var Q = function (T) {
                I(T, R, S)
            };
            B.Dom.batch(P, Q, B.Dom, true)
        },
        getXY: function (P) {
            var Q = function (R) {
                if ((R.parentNode === null || R.offsetParent === null || this.getStyle(R, "display") == "none") && R != R.ownerDocument.body) {
                    return false
                }
                return H(R)
            };
            return B.Dom.batch(P, Q, B.Dom, true)
        },
        getX: function (P) {
            var Q = function (R) {
                return B.Dom.getXY(R)[0]
            };
            return B.Dom.batch(P, Q, B.Dom, true)
        },
        getY: function (P) {
            var Q = function (R) {
                return B.Dom.getXY(R)[1]
            };
            return B.Dom.batch(P, Q, B.Dom, true)
        },
        setXY: function (P, S, R) {
            var Q = function (V) {
                var U = this.getStyle(V, "position");
                if (U == "static") {
                    this.setStyle(V, "position", "relative");
                    U = "relative"
                }
                var X = this.getXY(V);
                if (X === false) {
                    return false
                }
                var W = [parseInt(this.getStyle(V, "left"), 10), parseInt(this.getStyle(V, "top"), 10)];
                if (isNaN(W[0])) {
                    W[0] = (U == "relative") ? 0 : V.offsetLeft
                }
                if (isNaN(W[1])) {
                    W[1] = (U == "relative") ? 0 : V.offsetTop
                }
                if (S[0] !== null) {
                    V.style.left = S[0] - X[0] + W[0] + "px"
                }
                if (S[1] !== null) {
                    V.style.top = S[1] - X[1] + W[1] + "px"
                }
                if (!R) {
                    var T = this.getXY(V);
                    if ((S[0] !== null && T[0] != S[0]) || (S[1] !== null && T[1] != S[1])) {
                        this.setXY(V, S, true)
                    }
                }
            };
            B.Dom.batch(P, Q, B.Dom, true)
        },
        setX: function (Q, P) {
            B.Dom.setXY(Q, [P, null])
        },
        setY: function (P, Q) {
            B.Dom.setXY(P, [null, Q])
        },
        getRegion: function (P) {
            var Q = function (R) {
                if ((R.parentNode === null || R.offsetParent === null || this.getStyle(R, "display") == "none") && R != R.ownerDocument.body) {
                    return false
                }
                var S = B.Region.getRegion(R);
                return S
            };
            return B.Dom.batch(P, Q, B.Dom, true)
        },
        getClientWidth: function () {
            return B.Dom.getViewportWidth()
        },
        getClientHeight: function () {
            return B.Dom.getViewportHeight()
        },
        getElementsByClassName: function (T, X, U, V) {
            X = X || "*";
            U = (U) ? B.Dom.get(U) : null || M;
            if (!U) {
                return []
            }
            var Q = [],
                P = U.getElementsByTagName(X),
                W = O(T);
            for (var R = 0, S = P.length; R < S; ++R) {
                if (W.test(P[R].className)) {
                    Q[Q.length] = P[R];
                    if (V) {
                        V.call(P[R], P[R])
                    }
                }
            }
            return Q
        },
        hasClass: function (R, Q) {
            var P = O(Q);
            var S = function (T) {
                return P.test(T.className)
            };
            return B.Dom.batch(R, S, B.Dom, true)
        },
        addClass: function (Q, P) {
            var R = function (S) {
                if (this.hasClass(S, P)) {
                    return false
                }
                S.className = GVAR.lang.trim([S.className, P].join(" "));
                return true
            };
            return B.Dom.batch(Q, R, B.Dom, true)
        },
        removeClass: function (R, Q) {
            var P = O(Q);
            var S = function (T) {
                if (!Q || !this.hasClass(T, Q)) {
                    return false
                }
                var U = T.className;
                T.className = U.replace(P, " ");
                if (this.hasClass(T, Q)) {
                    this.removeClass(T, Q)
                }
                T.className = GVAR.lang.trim(T.className);
                return true
            };
            return B.Dom.batch(R, S, B.Dom, true)
        },
        replaceClass: function (S, Q, P) {
            if (!P || Q === P) {
                return false
            }
            var R = O(Q);
            var T = function (U) {
                if (!this.hasClass(U, Q)) {
                    this.addClass(U, P);
                    return true
                }
                U.className = U.className.replace(R, " " + P + " ");
                if (this.hasClass(U, Q)) {
                    this.replaceClass(U, Q, P)
                }
                U.className = GVAR.lang.trim(U.className);
                return true
            };
            return B.Dom.batch(S, T, B.Dom, true)
        },
        generateId: function (P, R) {
            R = R || "yui-gen";
            var Q = function (S) {
                if (S && S.id) {
                    return S.id
                }
                var T = R + GVAR.env._id_counter++;
                if (S) {
                    S.id = T
                }
                return T
            };
            return B.Dom.batch(P, Q, B.Dom, true) || Q.apply(B.Dom, arguments)
        },
        isAncestor: function (P, Q) {
            P = B.Dom.get(P);
            Q = B.Dom.get(Q);
            if (!P || !Q) {
                return false
            }
            if (P.contains && Q.nodeType && !L) {
                return P.contains(Q)
            } else {
                if (P.compareDocumentPosition && Q.nodeType) {
                    return !!(P.compareDocumentPosition(Q) & 16)
                } else {
                    if (Q.nodeType) {
                        return !!this.getAncestorBy(Q, function (R) {
                            return R == P
                        })
                    }
                }
            }
            return false
        },
        inDocument: function (P) {
            return this.isAncestor(M.documentElement, P)
        },
        getElementsBy: function (W, Q, R, T) {
            Q = Q || "*";
            R = (R) ? B.Dom.get(R) : null || M;
            if (!R) {
                return []
            }
            var S = [],
                V = R.getElementsByTagName(Q);
            for (var U = 0, P = V.length; U < P; ++U) {
                if (W(V[U])) {
                    S[S.length] = V[U];
                    if (T) {
                        T(V[U])
                    }
                }
            }
            return S
        },
        batch: function (T, W, V, R) {
            T = (T && (T.tagName || T.item)) ? T : B.Dom.get(T);
            if (!T || !W) {
                return false
            }
            var S = (R) ? V : window;
            if (T.tagName || T.length === undefined) {
                return W.call(S, T, V)
            }
            var U = [];
            for (var Q = 0, P = T.length; Q < P; ++Q) {
                U[U.length] = W.call(S, T[Q], V)
            }
            return U
        },
        getDocumentHeight: function () {
            var Q = (M.compatMode != "CSS1Compat") ? M.body.scrollHeight : M.documentElement.scrollHeight;
            var P = Math.max(Q, B.Dom.getViewportHeight());
            return P
        },
        getDocumentWidth: function () {
            var Q = (M.compatMode != "CSS1Compat") ? M.body.scrollWidth : M.documentElement.scrollWidth;
            var P = Math.max(Q, B.Dom.getViewportWidth());
            return P
        },
        getViewportHeight: function () {
            var P = self.innerHeight;
            var Q = M.compatMode;
            if ((Q || G) && !C) {
                P = (Q == "CSS1Compat") ? M.documentElement.clientHeight : M.body.clientHeight
            }
            return P
        },
        getViewportWidth: function () {
            var P = self.innerWidth;
            var Q = M.compatMode;
            if (Q || G) {
                P = (Q == "CSS1Compat") ? M.documentElement.clientWidth : M.body.clientWidth
            }
            return P
        },
        getAncestorBy: function (P, Q) {
            while (P = P.parentNode) {
                if (D(P, Q)) {
                    return P
                }
            }
            return null
        },
        getAncestorByClassName: function (Q, P) {
            Q = B.Dom.get(Q);
            if (!Q) {
                return null
            }
            var R = function (S) {
                return B.Dom.hasClass(S, P)
            };
            return B.Dom.getAncestorBy(Q, R)
        },
        getAncestorByTagName: function (Q, P) {
            Q = B.Dom.get(Q);
            if (!Q) {
                return null
            }
            var R = function (S) {
                return S.tagName && S.tagName.toUpperCase() == P.toUpperCase()
            };
            return B.Dom.getAncestorBy(Q, R)
        },
        getPreviousSiblingBy: function (P, Q) {
            while (P) {
                P = P.previousSibling;
                if (D(P, Q)) {
                    return P
                }
            }
            return null
        },
        getPreviousSibling: function (P) {
            P = B.Dom.get(P);
            if (!P) {
                return null
            }
            return B.Dom.getPreviousSiblingBy(P)
        },
        getNextSiblingBy: function (P, Q) {
            while (P) {
                P = P.nextSibling;
                if (D(P, Q)) {
                    return P
                }
            }
            return null
        },
        getNextSibling: function (P) {
            P = B.Dom.get(P);
            if (!P) {
                return null
            }
            return B.Dom.getNextSiblingBy(P)
        },
        getFirstChildBy: function (P, R) {
            var Q = (D(P.firstChild, R)) ? P.firstChild : null;
            return Q || B.Dom.getNextSiblingBy(P.firstChild, R)
        },
        getFirstChild: function (P, Q) {
            P = B.Dom.get(P);
            if (!P) {
                return null
            }
            return B.Dom.getFirstChildBy(P)
        },
        getLastChildBy: function (P, R) {
            if (!P) {
                return null
            }
            var Q = (D(P.lastChild, R)) ? P.lastChild : null;
            return Q || B.Dom.getPreviousSiblingBy(P.lastChild, R)
        },
        getLastChild: function (P) {
            P = B.Dom.get(P);
            return B.Dom.getLastChildBy(P)
        },
        getChildrenBy: function (Q, S) {
            var R = B.Dom.getFirstChildBy(Q, S);
            var P = R ? [R] : [];
            B.Dom.getNextSiblingBy(R, function (T) {
                if (!S || S(T)) {
                    P[P.length] = T
                }
                return false
            });
            return P
        },
        getChildren: function (P) {
            P = B.Dom.get(P);
            if (!P) {}
            return B.Dom.getChildrenBy(P)
        },
        getDocumentScrollLeft: function (P) {
            P = P || M;
            return Math.max(P.documentElement.scrollLeft, P.body.scrollLeft)
        },
        getDocumentScrollTop: function (P) {
            P = P || M;
            return Math.max(P.documentElement.scrollTop, P.body.scrollTop)
        },
        insertBefore: function (Q, P) {
            Q = B.Dom.get(Q);
            P = B.Dom.get(P);
            if (!Q || !P || !P.parentNode) {
                return null
            }
            return P.parentNode.insertBefore(Q, P)
        },
        insertAfter: function (Q, P) {
            Q = B.Dom.get(Q);
            P = B.Dom.get(P);
            if (!Q || !P || !P.parentNode) {
                return null
            }
            if (P.nextSibling) {
                return P.parentNode.insertBefore(Q, P.nextSibling)
            } else {
                return P.parentNode.appendChild(Q)
            }
        },
        getClientRegion: function () {
            var R = B.Dom.getDocumentScrollTop(),
                Q = B.Dom.getDocumentScrollLeft(),
                S = B.Dom.getViewportWidth() + Q,
                P = B.Dom.getViewportHeight() + R;
            return new B.Region(R, S, P, Q)
        }
    };
    var H = function () {
        if (M.documentElement.getBoundingClientRect) {
            return function (Q) {
                var R = Q.getBoundingClientRect();
                var P = Q.ownerDocument;
                return [R.left + B.Dom.getDocumentScrollLeft(P), R.top + B.Dom.getDocumentScrollTop(P)]
            }
        } else {
            return function (R) {
                var S = [R.offsetLeft, R.offsetTop];
                var Q = R.offsetParent;
                var P = (L && B.Dom.getStyle(R, "position") == "absolute" && R.offsetParent == R.ownerDocument.body);
                if (Q != R) {
                    while (Q) {
                        S[0] += Q.offsetLeft;
                        S[1] += Q.offsetTop;
                        if (!P && L && B.Dom.getStyle(Q, "position") == "absolute") {
                            P = true
                        }
                        Q = Q.offsetParent
                    }
                }
                if (P) {
                    S[0] -= R.ownerDocument.body.offsetLeft;
                    S[1] -= R.ownerDocument.body.offsetTop
                }
                Q = R.parentNode;
                while (Q.tagName && !E.ROOT_TAG.test(Q.tagName)) {
                    if (Q.scrollTop || Q.scrollLeft) {
                        if (!E.OP_SCROLL.test(B.Dom.getStyle(Q, "display"))) {
                            if (!C || B.Dom.getStyle(Q, "overflow") !== "visible") {
                                S[0] -= Q.scrollLeft;
                                S[1] -= Q.scrollTop
                            }
                        }
                    }
                    Q = Q.parentNode
                }
                return S
            }
        }
    }()
})();
GVAR.util.Region = function (C, D, A, B) {
    this.top = C;
    this[1] = C;
    this.right = D;
    this.bottom = A;
    this.left = B;
    this[0] = B
};
GVAR.util.Region.prototype.contains = function (A) {
    return (A.left >= this.left && A.right <= this.right && A.top >= this.top && A.bottom <= this.bottom)
};
GVAR.util.Region.prototype.getArea = function () {
    return ((this.bottom - this.top) * (this.right - this.left))
};
GVAR.util.Region.prototype.intersect = function (E) {
    var C = Math.max(this.top, E.top);
    var D = Math.min(this.right, E.right);
    var A = Math.min(this.bottom, E.bottom);
    var B = Math.max(this.left, E.left);
    if (A >= C && D >= B) {
        return new GVAR.util.Region(C, D, A, B)
    } else {
        return null
    }
};
GVAR.util.Region.prototype.union = function (E) {
    var C = Math.min(this.top, E.top);
    var D = Math.max(this.right, E.right);
    var A = Math.max(this.bottom, E.bottom);
    var B = Math.min(this.left, E.left);
    return new GVAR.util.Region(C, D, A, B)
};
GVAR.util.Region.prototype.toString = function () {
    return ("Region {top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + ", left: " + this.left + "}")
};
GVAR.util.Region.getRegion = function (D) {
    var F = GVAR.util.Dom.getXY(D);
    var C = F[1];
    var E = F[0] + D.offsetWidth;
    var A = F[1] + D.offsetHeight;
    var B = F[0];
    return new GVAR.util.Region(C, E, A, B)
};
GVAR.util.Point = function (A, B) {
    if (GVAR.lang.isArray(A)) {
        B = A[1];
        A = A[0]
    }
    this.x = this.right = this.left = this[0] = A;
    this.y = this.top = this.bottom = this[1] = B
};
GVAR.util.Point.prototype = new GVAR.util.Region();
GVAR.register("dom", GVAR.util.Dom, {
    version: "2.5.2",
    build: "1076"
});
GVAR.util.CustomEvent = function (D, B, C, A) {
    this.type = D;
    this.scope = B || window;
    this.silent = C;
    this.signature = A || GVAR.util.CustomEvent.LIST;
    this.subscribers = [];
    if (!this.silent) {}
    var E = "_YUICEOnSubscribe";
    if (D !== E) {
        this.subscribeEvent = new GVAR.util.CustomEvent(E, this, true)
    }
    this.lastError = null
};
GVAR.util.CustomEvent.LIST = 0;
GVAR.util.CustomEvent.FLAT = 1;
GVAR.util.CustomEvent.prototype = {
    subscribe: function (B, C, A) {
        if (!B) {
            throw new Error("Invalid callback for subscriber to '" + this.type + "'")
        }
        if (this.subscribeEvent) {
            this.subscribeEvent.fire(B, C, A)
        }
        this.subscribers.push(new GVAR.util.Subscriber(B, C, A))
    },
    unsubscribe: function (D, F) {
        if (!D) {
            return this.unsubscribeAll()
        }
        var E = false;
        for (var B = 0, A = this.subscribers.length; B < A; ++B) {
            var C = this.subscribers[B];
            if (C && C.contains(D, F)) {
                this._delete(B);
                E = true
            }
        }
        return E
    },
    fire: function () {
        this.lastError = null;
        var K = [],
            E = this.subscribers.length;
        if (!E && this.silent) {
            return true
        }
        var I = [].slice.call(arguments, 0),
            G = true,
            D, J = false;
        if (!this.silent) {}
        var C = this.subscribers.slice(),
            A = GVAR.util.Event.throwErrors;
        for (D = 0; D < E; ++D) {
            var M = C[D];
            if (!M) {
                J = true
            } else {
                if (!this.silent) {}
                var L = M.getScope(this.scope);
                if (this.signature == GVAR.util.CustomEvent.FLAT) {
                    var B = null;
                    if (I.length > 0) {
                        B = I[0]
                    }
                    try {
                        G = M.fn.call(L, B, M.obj)
                    } catch (F) {
                        this.lastError = F;
                        if (A) {
                            throw F
                        }
                    }
                } else {
                    try {
                        G = M.fn.call(L, this.type, I, M.obj)
                    } catch (H) {
                        this.lastError = H;
                        if (A) {
                            throw H
                        }
                    }
                }
                if (false === G) {
                    if (!this.silent) {}
                    break
                }
            }
        }
        return (G !== false)
    },
    unsubscribeAll: function () {
        for (var A = this.subscribers.length - 1; A > -1; A--) {
            this._delete(A)
        }
        this.subscribers = [];
        return A
    },
    _delete: function (A) {
        var B = this.subscribers[A];
        if (B) {
            delete B.fn;
            delete B.obj
        }
        this.subscribers.splice(A, 1)
    },
    toString: function () {
        return "CustomEvent: '" + this.type + "', scope: " + this.scope
    }
};
GVAR.util.Subscriber = function (B, C, A) {
    this.fn = B;
    this.obj = GVAR.lang.isUndefined(C) ? null : C;
    this.override = A
};
GVAR.util.Subscriber.prototype.getScope = function (A) {
    if (this.override) {
        if (this.override === true) {
            return this.obj
        } else {
            return this.override
        }
    }
    return A
};
GVAR.util.Subscriber.prototype.contains = function (A, B) {
    if (B) {
        return (this.fn == A && this.obj == B)
    } else {
        return (this.fn == A)
    }
};
GVAR.util.Subscriber.prototype.toString = function () {
    return "Subscriber { obj: " + this.obj + ", override: " + (this.override || "no") + " }"
};
if (!GVAR.util.Event) {
    GVAR.util.Event = function () {
        var H = false;
        var I = [];
        var J = [];
        var G = [];
        var E = [];
        var C = 0;
        var F = [];
        var B = [];
        var A = 0;
        var D = {
            63232: 38,
            63233: 40,
            63234: 37,
            63235: 39,
            63276: 33,
            63277: 34,
            25: 9
        };
        return {
            POLL_RETRYS: 2000,
            POLL_INTERVAL: 20,
            EL: 0,
            TYPE: 1,
            FN: 2,
            WFN: 3,
            UNLOAD_OBJ: 3,
            ADJ_SCOPE: 4,
            OBJ: 5,
            OVERRIDE: 6,
            lastError: null,
            isSafari: GVAR.env.ua.webkit,
            webkit: GVAR.env.ua.webkit,
            isIE: GVAR.env.ua.ie,
            _interval: null,
            _dri: null,
            DOMReady: false,
            throwErrors: false,
            startInterval: function () {
                if (!this._interval) {
                    var K = this;
                    var L = function () {
                        K._tryPreloadAttach()
                    };
                    this._interval = setInterval(L, this.POLL_INTERVAL)
                }
            },
            onAvailable: function (P, M, Q, O, N) {
                var K = (GVAR.lang.isString(P)) ? [P] : P;
                for (var L = 0; L < K.length; L = L + 1) {
                    F.push({
                        id: K[L],
                        fn: M,
                        obj: Q,
                        override: O,
                        checkReady: N
                    })
                }
                C = this.POLL_RETRYS;
                this.startInterval()
            },
            onContentReady: function (M, K, N, L) {
                this.onAvailable(M, K, N, L, true)
            },
            onDOMReady: function (K, M, L) {
                if (this.DOMReady) {
                    setTimeout(function () {
                        var N = window;
                        if (L) {
                            if (L === true) {
                                N = M
                            } else {
                                N = L
                            }
                        }
                        K.call(N, "DOMReady", [], M)
                    }, 0)
                } else {
                    this.DOMReadyEvent.subscribe(K, M, L)
                }
            },
            addListener: function (M, K, V, Q, L) {
                if (!V || !V.call) {
                    return false
                }
                if (this._isValidCollection(M)) {
                    var W = true;
                    for (var R = 0, T = M.length; R < T; ++R) {
                        W = this.on(M[R], K, V, Q, L) && W
                    }
                    return W
                } else {
                    if (GVAR.lang.isString(M)) {
                        var P = this.getEl(M);
                        if (P) {
                            M = P
                        } else {
                            this.onAvailable(M, function () {
                                GVAR.util.Event.on(M, K, V, Q, L)
                            });
                            return true
                        }
                    }
                }
                if (!M) {
                    return false
                }
                if ("unload" == K && Q !== this) {
                    J[J.length] = [M, K, V, Q, L];
                    return true
                }
                var Y = M;
                if (L) {
                    if (L === true) {
                        Y = Q
                    } else {
                        Y = L
                    }
                }
                var N = function (Z) {
                    return V.call(Y, GVAR.util.Event.getEvent(Z, M), Q)
                };
                var X = [M, K, V, N, Y, Q, L];
                var S = I.length;
                I[S] = X;
                if (this.useLegacyEvent(M, K)) {
                    var O = this.getLegacyIndex(M, K);
                    if (O == -1 || M != G[O][0]) {
                        O = G.length;
                        B[M.id + K] = O;
                        G[O] = [M, K, M["on" + K]];
                        E[O] = [];
                        M["on" + K] = function (Z) {
                            GVAR.util.Event.fireLegacyEvent(GVAR.util.Event.getEvent(Z), O)
                        }
                    }
                    E[O].push(X)
                } else {
                    try {
                        this._simpleAdd(M, K, N, false)
                    } catch (U) {
                        this.lastError = U;
                        this.removeListener(M, K, V);
                        return false
                    }
                }
                return true
            },
            fireLegacyEvent: function (O, M) {
                var Q = true,
                    K, S, R, T, P;
                S = E[M].slice();
                for (var L = 0, N = S.length; L < N; ++L) {
                    R = S[L];
                    if (R && R[this.WFN]) {
                        T = R[this.ADJ_SCOPE];
                        P = R[this.WFN].call(T, O);
                        Q = (Q && P)
                    }
                }
                K = G[M];
                if (K && K[2]) {
                    K[2](O)
                }
                return Q
            },
            getLegacyIndex: function (L, M) {
                var K = this.generateId(L) + M;
                if (typeof B[K] == "undefined") {
                    return -1
                } else {
                    return B[K]
                }
            },
            useLegacyEvent: function (L, M) {
                if (this.webkit && ("click" == M || "dblclick" == M)) {
                    var K = parseInt(this.webkit, 10);
                    if (!isNaN(K) && K < 418) {
                        return true
                    }
                }
                return false
            },
            removeListener: function (L, K, T) {
                var O, R, V;
                if (typeof L == "string") {
                    L = this.getEl(L)
                } else {
                    if (this._isValidCollection(L)) {
                        var U = true;
                        for (O = L.length - 1; O > -1; O--) {
                            U = (this.removeListener(L[O], K, T) && U)
                        }
                        return U
                    }
                }
                if (!T || !T.call) {
                    return this.purgeElement(L, false, K)
                }
                if ("unload" == K) {
                    for (O = J.length - 1; O > -1; O--) {
                        V = J[O];
                        if (V && V[0] == L && V[1] == K && V[2] == T) {
                            J.splice(O, 1);
                            return true
                        }
                    }
                    return false
                }
                var P = null;
                var Q = arguments[3];
                if ("undefined" === typeof Q) {
                    Q = this._getCacheIndex(L, K, T)
                }
                if (Q >= 0) {
                    P = I[Q]
                }
                if (!L || !P) {
                    return false
                }
                if (this.useLegacyEvent(L, K)) {
                    var N = this.getLegacyIndex(L, K);
                    var M = E[N];
                    if (M) {
                        for (O = 0, R = M.length; O < R; ++O) {
                            V = M[O];
                            if (V && V[this.EL] == L && V[this.TYPE] == K && V[this.FN] == T) {
                                M.splice(O, 1);
                                break
                            }
                        }
                    }
                } else {
                    try {
                        this._simpleRemove(L, K, P[this.WFN], false)
                    } catch (S) {
                        this.lastError = S;
                        return false
                    }
                }
                delete I[Q][this.WFN];
                delete I[Q][this.FN];
                I.splice(Q, 1);
                return true
            },
            getTarget: function (M, L) {
                var K = M.target || M.srcElement;
                return this.resolveTextNode(K)
            },
            resolveTextNode: function (L) {
                try {
                    if (L && 3 == L.nodeType) {
                        return L.parentNode
                    }
                } catch (K) {}
                return L
            },
            getPageX: function (L) {
                var K = L.pageX;
                if (!K && 0 !== K) {
                    K = L.clientX || 0;
                    if (this.isIE) {
                        K += this._getScrollLeft()
                    }
                }
                return K
            },
            getPageY: function (K) {
                var L = K.pageY;
                if (!L && 0 !== L) {
                    L = K.clientY || 0;
                    if (this.isIE) {
                        L += this._getScrollTop()
                    }
                }
                return L
            },
            getXY: function (K) {
                return [this.getPageX(K), this.getPageY(K)]
            },
            getRelatedTarget: function (L) {
                var K = L.relatedTarget;
                if (!K) {
                    if (L.type == "mouseout") {
                        K = L.toElement
                    } else {
                        if (L.type == "mouseover") {
                            K = L.fromElement
                        }
                    }
                }
                return this.resolveTextNode(K)
            },
            getTime: function (M) {
                if (!M.time) {
                    var L = new Date().getTime();
                    try {
                        M.time = L
                    } catch (K) {
                        this.lastError = K;
                        return L
                    }
                }
                return M.time
            },
            stopEvent: function (K) {
                this.stopPropagation(K);
                this.preventDefault(K)
            },
            stopPropagation: function (K) {
                if (K.stopPropagation) {
                    K.stopPropagation()
                } else {
                    K.cancelBubble = true
                }
            },
            preventDefault: function (K) {
                if (K.preventDefault) {
                    K.preventDefault()
                } else {
                    K.returnValue = false
                }
            },
            getEvent: function (M, K) {
                var L = M || window.event;
                if (!L) {
                    var N = this.getEvent.caller;
                    while (N) {
                        L = N.arguments[0];
                        if (L && Event == L.constructor) {
                            break
                        }
                        N = N.caller
                    }
                }
                return L
            },
            getCharCode: function (L) {
                var K = L.keyCode || L.charCode || 0;
                if (GVAR.env.ua.webkit && (K in D)) {
                    K = D[K]
                }
                return K
            },
            _getCacheIndex: function (O, P, N) {
                for (var M = 0, L = I.length; M < L; M = M + 1) {
                    var K = I[M];
                    if (K && K[this.FN] == N && K[this.EL] == O && K[this.TYPE] == P) {
                        return M
                    }
                }
                return -1
            },
            generateId: function (K) {
                var L = K.id;
                if (!L) {
                    L = "yuievtautoid-" + A;
                    ++A;
                    K.id = L
                }
                return L
            },
            _isValidCollection: function (L) {
                try {
                    return (L && typeof L !== "string" && L.length && !L.tagName && !L.alert && typeof L[0] !== "undefined")
                } catch (K) {
                    return false
                }
            },
            elCache: {},
            getEl: function (K) {
                return (typeof K === "string") ? document.getElementById(K) : K
            },
            clearCache: function () {},
            DOMReadyEvent: new GVAR.util.CustomEvent("DOMReady", this),
            _load: function (L) {
                if (!H) {
                    H = true;
                    var K = GVAR.util.Event;
                    K._ready();
                    K._tryPreloadAttach()
                }
            },
            _ready: function (L) {
                var K = GVAR.util.Event;
                if (!K.DOMReady) {
                    K.DOMReady = true;
                    K.DOMReadyEvent.fire();
                    K._simpleRemove(document, "DOMContentLoaded", K._ready)
                }
            },
            _tryPreloadAttach: function () {
                if (F.length === 0) {
                    C = 0;
                    clearInterval(this._interval);
                    this._interval = null;
                    return
                }
                if (this.locked) {
                    return
                }
                if (this.isIE) {
                    if (!this.DOMReady) {
                        this.startInterval();
                        return
                    }
                }
                this.locked = true;
                var Q = !H;
                if (!Q) {
                    Q = (C > 0 && F.length > 0)
                }
                var P = [];
                var R = function (T, U) {
                    var S = T;
                    if (U.override) {
                        if (U.override === true) {
                            S = U.obj
                        } else {
                            S = U.override
                        }
                    }
                    U.fn.call(S, U.obj)
                };
                var L, K, O, N, M = [];
                for (L = 0, K = F.length; L < K; L = L + 1) {
                    O = F[L];
                    if (O) {
                        N = this.getEl(O.id);
                        if (N) {
                            if (O.checkReady) {
                                if (H || N.nextSibling || !Q) {
                                    M.push(O);
                                    F[L] = null
                                }
                            } else {
                                R(N, O);
                                F[L] = null
                            }
                        } else {
                            P.push(O)
                        }
                    }
                }
                for (L = 0, K = M.length; L < K; L = L + 1) {
                    O = M[L];
                    R(this.getEl(O.id), O)
                }
                C--;
                if (Q) {
                    for (L = F.length - 1; L > -1; L--) {
                        O = F[L];
                        if (!O || !O.id) {
                            F.splice(L, 1)
                        }
                    }
                    this.startInterval()
                } else {
                    clearInterval(this._interval);
                    this._interval = null
                }
                this.locked = false
            },
            purgeElement: function (O, P, R) {
                var M = (GVAR.lang.isString(O)) ? this.getEl(O) : O;
                var Q = this.getListeners(M, R),
                    N, K;
                if (Q) {
                    for (N = Q.length - 1; N > -1; N--) {
                        var L = Q[N];
                        this.removeListener(M, L.type, L.fn)
                    }
                }
                if (P && M && M.childNodes) {
                    for (N = 0, K = M.childNodes.length; N < K; ++N) {
                        this.purgeElement(M.childNodes[N], P, R)
                    }
                }
            },
            getListeners: function (M, K) {
                var P = [],
                    L;
                if (!K) {
                    L = [I, J]
                } else {
                    if (K === "unload") {
                        L = [J]
                    } else {
                        L = [I]
                    }
                }
                var R = (GVAR.lang.isString(M)) ? this.getEl(M) : M;
                for (var O = 0; O < L.length; O = O + 1) {
                    var T = L[O];
                    if (T) {
                        for (var Q = 0, S = T.length; Q < S; ++Q) {
                            var N = T[Q];
                            if (N && N[this.EL] === R && (!K || K === N[this.TYPE])) {
                                P.push({
                                    type: N[this.TYPE],
                                    fn: N[this.FN],
                                    obj: N[this.OBJ],
                                    adjust: N[this.OVERRIDE],
                                    scope: N[this.ADJ_SCOPE],
                                    index: Q
                                })
                            }
                        }
                    }
                }
                return (P.length) ? P : null
            },
            _unload: function (Q) {
                var K = GVAR.util.Event,
                    N, M, L, P, O, R = J.slice();
                for (N = 0, P = J.length; N < P; ++N) {
                    L = R[N];
                    if (L) {
                        var S = window;
                        if (L[K.ADJ_SCOPE]) {
                            if (L[K.ADJ_SCOPE] === true) {
                                S = L[K.UNLOAD_OBJ]
                            } else {
                                S = L[K.ADJ_SCOPE]
                            }
                        }
                        L[K.FN].call(S, K.getEvent(Q, L[K.EL]), L[K.UNLOAD_OBJ]);
                        R[N] = null;
                        L = null;
                        S = null
                    }
                }
                J = null;
                if (I) {
                    for (M = I.length - 1; M > -1; M--) {
                        L = I[M];
                        if (L) {
                            K.removeListener(L[K.EL], L[K.TYPE], L[K.FN], M)
                        }
                    }
                    L = null
                }
                G = null;
                K._simpleRemove(window, "unload", K._unload)
            },
            _getScrollLeft: function () {
                return this._getScroll()[1]
            },
            _getScrollTop: function () {
                return this._getScroll()[0]
            },
            _getScroll: function () {
                var K = document.documentElement,
                    L = document.body;
                if (K && (K.scrollTop || K.scrollLeft)) {
                    return [K.scrollTop, K.scrollLeft]
                } else {
                    if (L) {
                        return [L.scrollTop, L.scrollLeft]
                    } else {
                        return [0, 0]
                    }
                }
            },
            regCE: function () {},
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function (M, N, L, K) {
                        M.addEventListener(N, L, (K))
                    }
                } else {
                    if (window.attachEvent) {
                        return function (M, N, L, K) {
                            M.attachEvent("on" + N, L)
                        }
                    } else {
                        return function () {}
                    }
                }
            }(),
            _simpleRemove: function () {
                if (window.removeEventListener) {
                    return function (M, N, L, K) {
                        M.removeEventListener(N, L, (K))
                    }
                } else {
                    if (window.detachEvent) {
                        return function (L, M, K) {
                            L.detachEvent("on" + M, K)
                        }
                    } else {
                        return function () {}
                    }
                }
            }()
        }
    }();
    (function () {
        var EU = GVAR.util.Event;
        EU.on = EU.addListener;
        if (EU.isIE) {
            GVAR.util.Event.onDOMReady(GVAR.util.Event._tryPreloadAttach, GVAR.util.Event, true);
            var n = document.createElement("p");
            EU._dri = setInterval(function () {
                try {
                    n.doScroll("left");
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                    n = null
                } catch (ex) {}
            }, EU.POLL_INTERVAL)
        } else {
            if (EU.webkit && EU.webkit < 525) {
                EU._dri = setInterval(function () {
                    var rs = document.readyState;
                    if ("loaded" == rs || "complete" == rs) {
                        clearInterval(EU._dri);
                        EU._dri = null;
                        EU._ready()
                    }
                }, EU.POLL_INTERVAL)
            } else {
                EU._simpleAdd(document, "DOMContentLoaded", EU._ready)
            }
        }
        EU._simpleAdd(window, "load", EU._load);
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach()
    })()
}
GVAR.util.EventProvider = function () {};
GVAR.util.EventProvider.prototype = {
    __yui_events: null,
    __yui_subscribers: null,
    subscribe: function (A, C, F, E) {
        this.__yui_events = this.__yui_events || {};
        var D = this.__yui_events[A];
        if (D) {
            D.subscribe(C, F, E)
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var B = this.__yui_subscribers;
            if (!B[A]) {
                B[A] = []
            }
            B[A].push({
                fn: C,
                obj: F,
                override: E
            })
        }
    },
    unsubscribe: function (C, E, G) {
        this.__yui_events = this.__yui_events || {};
        var A = this.__yui_events;
        if (C) {
            var F = A[C];
            if (F) {
                return F.unsubscribe(E, G)
            }
        } else {
            var B = true;
            for (var D in A) {
                if (GVAR.lang.hasOwnProperty(A, D)) {
                    B = B && A[D].unsubscribe(E, G)
                }
            }
            return B
        }
        return false
    },
    unsubscribeAll: function (A) {
        return this.unsubscribe(A)
    },
    createEvent: function (G, D) {
        this.__yui_events = this.__yui_events || {};
        var A = D || {};
        var I = this.__yui_events;
        if (I[G]) {} else {
            var H = A.scope || this;
            var E = (A.silent);
            var B = new GVAR.util.CustomEvent(G, H, E, GVAR.util.CustomEvent.FLAT);
            I[G] = B;
            if (A.onSubscribeCallback) {
                B.subscribeEvent.subscribe(A.onSubscribeCallback)
            }
            this.__yui_subscribers = this.__yui_subscribers || {};
            var F = this.__yui_subscribers[G];
            if (F) {
                for (var C = 0; C < F.length; ++C) {
                    B.subscribe(F[C].fn, F[C].obj, F[C].override)
                }
            }
        }
        return I[G]
    },
    fireEvent: function (E, D, A, C) {
        this.__yui_events = this.__yui_events || {};
        var G = this.__yui_events[E];
        if (!G) {
            return null
        }
        var B = [];
        for (var F = 1; F < arguments.length; ++F) {
            B.push(arguments[F])
        }
        return G.fire.apply(G, B)
    },
    hasEvent: function (A) {
        if (this.__yui_events) {
            if (this.__yui_events[A]) {
                return true
            }
        }
        return false
    }
};
GVAR.util.KeyListener = function (A, F, B, C) {
    if (!A) {} else {
        if (!F) {} else {
            if (!B) {}
        }
    }
    if (!C) {
        C = GVAR.util.KeyListener.KEYDOWN
    }
    var D = new GVAR.util.CustomEvent("keyPressed");
    this.enabledEvent = new GVAR.util.CustomEvent("enabled");
    this.disabledEvent = new GVAR.util.CustomEvent("disabled");
    if (typeof A == "string") {
        A = document.getElementById(A)
    }
    if (typeof B == "function") {
        D.subscribe(B)
    } else {
        D.subscribe(B.fn, B.scope, B.correctScope)
    }
    function E(J, I) {
        if (!F.shift) {
            F.shift = false
        }
        if (!F.alt) {
            F.alt = false
        }
        if (!F.ctrl) {
            F.ctrl = false
        }
        if (J.shiftKey == F.shift && J.altKey == F.alt && J.ctrlKey == F.ctrl) {
            var G;
            if (F.keys instanceof Array) {
                for (var H = 0; H < F.keys.length; H++) {
                    G = F.keys[H];
                    if (G == J.charCode) {
                        D.fire(J.charCode, J);
                        break
                    } else {
                        if (G == J.keyCode) {
                            D.fire(J.keyCode, J);
                            break
                        }
                    }
                }
            } else {
                G = F.keys;
                if (G == J.charCode) {
                    D.fire(J.charCode, J)
                } else {
                    if (G == J.keyCode) {
                        D.fire(J.keyCode, J)
                    }
                }
            }
        }
    }
    this.enable = function () {
        if (!this.enabled) {
            GVAR.util.Event.addListener(A, C, E);
            this.enabledEvent.fire(F)
        }
        this.enabled = true
    };
    this.disable = function () {
        if (this.enabled) {
            GVAR.util.Event.removeListener(A, C, E);
            this.disabledEvent.fire(F)
        }
        this.enabled = false
    };
    this.toString = function () {
        return "KeyListener [" + F.keys + "] " + A.tagName + (A.id ? "[" + A.id + "]" : "")
    }
};
GVAR.util.KeyListener.KEYDOWN = "keydown";
GVAR.util.KeyListener.KEYUP = "keyup";
GVAR.util.KeyListener.KEY = {
    ALT: 18,
    BACK_SPACE: 8,
    CAPS_LOCK: 20,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    META: 224,
    NUM_LOCK: 144,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PAUSE: 19,
    PRINTSCREEN: 44,
    RIGHT: 39,
    SCROLL_LOCK: 145,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    UP: 38
};
GVAR.register("event", GVAR.util.Event, {
    version: "2.5.2",
    build: "1076"
});
GVAR.register("GVAR-dom-event", GVAR, {
    version: "2.5.2",
    build: "1076"
});

function openPopup(asin, item, urlGet) {
    self.name = "mainWindow";
    var quantity = (item == "displayBuyBox") ? document.getElementById("qtty").value : 1;
    if (item == "displayBuyBox" && document.getElementById("freeGiftBBO")) {
        var freeBenefitASIN = document.getElementById("freeBenefitASIN").value;
        window.open("/gp/detail/map-popup.html/?quantity=" + quantity + "&asin=" + asin + "&freeBenefitASIN=" + freeBenefitASIN, "named", "location=no,menubar=no,resizable=no,height=425,width=675,scrollbars=no,left=220,screenX=220,top=70,screenY=70")
    } else {
        window.open("/gp/detail/map-popup.html/?quantity=" + quantity + "&asin=" + asin + "&urlGet=" + urlGet, "named", "location=no,menubar=no,resizable=no,height=425,width=675,scrollbars=no,left=220,screenX=220,top=70,screenY=70")
    }
};

function html_esc(str) {
    var entity = {
        "'": "&apos;",
        '"': "&quot;",
        "<": "&lt;",
        ">": "&gt;"
    };
    for (var e in entity) {
        str = str.replace(new RegExp(e, "g"), entity[e])
    }
    return str
}
function esc_length_ok(str, len) {
    return (html_esc(str).length <= len)
}
function checkEmail(email) {
    if (!email) {
        return true
    }
    if (email.value == "") {
        alert("Please enter your email address.");
        email.focus()
    } else {
        if (/^\w+([\.-]\w+)*@\w+([\.-]\w+)*\.\w{2,}$/.test(email.value)) {
            return true
        } else {
            alert("Please enter a valid email address.");
            email.focus()
        }
    }
    return false
}
function amz_js_PopWin(url, name, options) {
    var winHelp = window.open(url, name, options);
    if (winHelp) {
        winHelp.opener = this;
        winHelp.focus()
    }
}
function countRemainingWordsReviewBody() {
    var maxCount = 1000;
    var textArea = document.getElementById("review");
    var review = textArea.value;
    review = review.split(/\s+/);
    currWordCount = review.length;
    if (currWordCount > maxCount) {
        var truncatedText = "";
        for (i = 0; i < 999; i++) {
            truncatedText += review[i] + " "
        }
        truncatedText += review[999];
        textArea.value = truncatedText;
        textArea.scrollTop = textArea.scrollHeight - textArea.clientHeight
    }
    if (currWordCount >= 997) {
        document.getElementById("reviewCount").style.color = "#9E0B0F"
    } else {
        document.getElementById("reviewCount").style.color = "#999999"
    }
    if (currWordCount == 999) {
        document.getElementById("reviewCount").innerHTML = "1 word left"
    } else {
        if (currWordCount >= 1000) {
            document.getElementById("reviewCount").innerHTML = "0 words left"
        } else {
            document.getElementById("reviewCount").innerHTML = (maxCount - currWordCount) + " words left"
        }
    }
};

(function ($) {
    jQuery.fn.quickinfo = function (newOptions) {
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).quickinfo(newOptions)
            }
            return this
        }
        if (this.length < 1) {
            return this
        }
        var quickinfo = this;
        var baseOptions = {
            buttonClass: "quickInfoButton",
            activeClass: "quickInfoActive",
            buttonOnly: false,
            invokeFunction: "invokeQuickInfo",
            queryString: ""
        };
        var options = $.extend(baseOptions, newOptions);
        this.initialize = function () {
            var relInfo = this.attr("id");
            var relInfoParts = relInfo.split(":");
            if (relInfoParts.length < 2) {
                return false
            } else {
                this.data("args", relInfoParts)
            }
            this.addDom();
            this.addEvents();
            this.data("active", false);
            return this
        };
        this.addDom = function () {
            var qiButton = document.createElement("span");
            qiButton.className = options.buttonClass;
            this.prepend(qiButton);
            this.data("qiButton", $(qiButton));
            this.addClass(options.activeClass)
        };
        this.addEvents = function () {
            var clickEl;
            if (options.buttonOnly == true) {
                clickEl = this.data("qiButton")
            } else {
                clickEl = this
            }
            clickEl.hover(function () {
                quickinfo.data("active", true)
            }, function () {
                quickinfo.hide().show();
                quickinfo.data("active", false)
            }).keydown(function () {
                quickinfo.data("active", true)
            }).keyup(function () {
                window.setTimeout(function () {
                    quickinfo.data("active", false)
                }, 1)
            }).click(function (event) {
                e = window.event || event;
                if (quickinfo.data("active") != true) {
                    return true
                }
                qi = $(this).data("quickinfo");
                args = quickinfo.data("args");
                args.push(this);
                var queryString = "";
                if (typeof options.queryString == "string") {
                    queryString = options.queryString
                } else {
                    if (typeof options.queryString == "function") {
                        queryString = options.queryString.call(this)
                    }
                }
                args.push(queryString);
                var functionToCall = window[options.invokeFunction];
                if (typeof functionToCall == "function") {
                    functionToCall.apply(quickinfo, args)
                }
                return false
            })
        };
        return this.initialize()
    }
})(jQuery);

var target = window.target || {};
target.ui = target.ui || {};
target.ui.gn = target.ui.gn || {};
target.ui.gn.data = target.ui.gn.data || {};

target.ui.gn.RefTag = {
    defaultRefFormat: "@_#c",
    getRefTag: function getRefTag(format, data) {
        var ref = "";
        format = format || this.defaultRefFormat;
        data = data || {};
        var c = ((typeof data.childOrder == "undefined") ? 0 : data.childOrder);
        var m = ((typeof data.menuOrder == "undefined") ? 0 : data.menuOrder);
        var f = ((typeof data.flyoutNumber == "undefined") ? 0 : data.flyoutNumber);
        var p = ((typeof data.parentRefTag == "undefined") ? "" : data.parentRefTag);
        try {
            ref = format;
            ref = ref.replace("#c", c, "g");
            ref = ref.replace("#m", m, "g");
            ref = ref.replace("#f", f, "g");
            ref = ref.replace("#p", p, "g")
        } catch (e) {
            ref = ""
        }
        return ref
    }
};

target.ui.gn.Node = function Node_Ctor(nodeData, paramsObject) {
    if (!nodeData) {
        return null
    }
    paramsObject = paramsObject || {};
    var recurse = paramsObject.recurse || 0;
    this.parentNode = paramsObject.parentNode || null;
    this.siblingNumber = paramsObject.siblingNumber || null;
    this.refValues = paramsObject.refValues || {};
    this.flyoutNumber = paramsObject.flyoutNumber || 0;
    this.addedUrlParams = paramsObject.addedUrlParams || "";
    if (!this.flyoutNumber && this.parentNode) {
        this.flyoutNumber = this.parentNode.flyoutNumber
    }
    var menuOrderCounter = paramsObject.menuOrder;
    if (menuOrderCounter) {
        this.menuOrder = menuOrderCounter.counter;
        if (nodeData.location) {
            menuOrderCounter.counter++
        }
    }
    this.secure = nodeData.secure && nodeData.secure == "true";
    this.text = nodeData.text || "";
    this.title = (typeof nodeData.title == "string" ? nodeData.title : this.text);
    this.name = nodeData.name || "";
    this.location = nodeData.location || "";
    this.children = nodeData.children || [];
    this.icnTag = nodeData.icnTag || "";
    this.childNodes = [];
    this.refFormat = nodeData.ref_format || "";
    this.forceIncat = nodeData.forceIncat || "";
    this.desc = nodeData.desc || "";
    var self = this;
    this.getDomTemplate = function getDomTemplate_Node(className) {
        var href = self.getHref();
        if (href != "") {
            self.domTemplate = {
                tagName: "a",
                href: href,
                title: self.title,
                childNodes: [{
                    tagName: "span",
                    innerHTML: self.text
                }]
            }
        } else {
            if (className) {
                className += " nolink"
            }
            self.domTemplate = {
                tagName: "span",
                className: "nolink",
                childNodes: [{
                    tagName: "span",
                    innerHTML: self.text
                }]
            }
        }
        if (className) {
            self.domTemplate.className = className
        }
        return self.domTemplate
    };
    this.getHtml = function () {};
    this.isParent = function isParent() {
        return ( !! self.children && self.children.length > 0)
    };
    this.isLink = function isLink() {
        return ( !! self.location)
    };
    this.getParent = function getParent() {
        return self.parentNode
    };
    this.isBrowseNode = function isBrowseNode() {
        return (!isNaN(self.location))
    };
    this.getRefFormat = function getRefFormat() {
        if (!self.refFormat) {
            var n = self;
            while (n = n.parentNode) {
                if (n.refFormat) {
                    self.refFormat = n.refFormat;
                    break
                }
            }
        }
        return self.refFormat
    };
    this.getForceIncat = function getForceIncat() {
        if (!self.forceIncat) {
            var n = self.parentNode;
            while (n) {
                if (n.forceIncat) {
                    self.forceIncat = n.forceIncat;
                    break
                }
                n = n.parentNode
            }
        }
        if (self.forceIncat == "none") {
            self.forceIncat = ""
        }
        return self.forceIncat
    };
    this.getRefTag = function getRefTag() {
        if (!self.refTag) {
            if (typeof nodeData.ref == "string") {
                self.refTag = nodeData.ref
            } else {
                var format = self.getRefFormat();
                var refValues = self.refValues;
                refValues.childOrder = self.siblingNumber;
                refValues.menuOrder = self.menuOrder;
                refValues.flyoutNumber = self.flyoutNumber;
                refValues.parentRefTag = self.parentNode.refTag;
                self.refTag = target.ui.gn.RefTag.getRefTag(format, refValues)
            }
        }
        return self.refTag
    };
    this.getHref = function getHref() {
        if (!self.href) {
            if (!self.location) {
                self.href = "";
                return self.href
            }
            var refString = self.getRefTag();
            var incatString = self.getForceIncat();
            if (incatString) {
                incatString = "forceIncat=" + incatString
            }
            var location = self.location;
            var description = self.desc;
            var server = self.secure ? target.ui.gn.secureserver : target.ui.gn.nonsecureserver;
            server = server || "";
            var moreParams = self.addedUrlParams;
            var urlParamDelimiter = "&";
            if (location.indexOf("?") == -1) {
                urlParamDelimiter = "?"
            }
            if (location.indexOf("/") == 0) {
                if (refString) {
                    refString = urlParamDelimiter + "ref=" + refString;
                    urlParamDelimiter = "&"
                }
                if (incatString) {
                    incatString = urlParamDelimiter + incatString;
                    urlParamDelimiter = "&"
                }
                if (moreParams) {
                    moreParams = urlParamDelimiter + moreParams
                }
                self.href = server + location + refString + incatString + moreParams
            } else {
                if (location.indexOf("#") == 0) {
                    self.href = location
                } else {
                    if (self.isBrowseNode()) {
                        if (refString) {
                            refString = "/ref=" + refString
                        }
                        if (incatString) {
                            incatString = "&" + incatString
                        }
                        if (moreParams) {
                            moreParams = "&" + moreParams
                        }
                        if (description) {
                            description = "/" + description
                        }
                        self.href = server + description + "/b" + refString + "?ie=UTF8&node=" + location + incatString + moreParams
                    } else {
                        if (refString) {
                            refString = encodeURIComponent(refString);
                            refString = refString.replace("_", "%5F", "g");
                            refString = "ref=" + refString
                        }
                        var redirect = "/gp/redirect.html";
                        if (target.ui.gn.isRainier) {
                            redirect = "/gp/preview/redirect.html"
                        }
                        var destination = location + urlParamDelimiter + refString;
                        self.href = server + redirect + "?%5Fencoding=UTF8&location=" + encodeURIComponent(destination)
                    }
                }
            }
        }
        return self.href
    };
    this.buildRecursive = function buildRecursive() {
        for (var i = 0, len = self.children.length; i < len; i++) {
            self.childNodes.push(new target.ui.gn.Node(self.children[i], {
                parentNode: self,
                siblingNumber: i + 1,
                menuOrder: menuOrderCounter,
                recurse: recurse - 1,
                addedUrlParams: self.addedUrlParams
            }))
        }
    };
    if (recurse) {
        this.buildRecursive()
    }
    return this
};

target.ui.gn.Flyout = function Flyout_Ctor(rootElement, structure, index, type) {
    var self = this;
    this.rootElement = rootElement;
    this.structure = structure;
    if (structure && structure.counts) {
        this.counts = structure.counts
    } else {
        this.counts = []
    }
    this.flyoutNumber = index + 1;
    this.type = type || "";
    var domAttachmentPoint;
    this.refValues = {
        childOrder: 0,
        menuOrder: 0,
        flyoutNumber: this.flyoutNumber,
        parentRefTag: ""
    };
    self.refValues.menuOrder++;
    this.getDomTemplate = function getDomTemplate_Flyout() {
        if (!self.domTemplate) {
            if (this.structure && this.counts.length) {
                var tabTmpl = self.rootElement.getDomTemplate();
                var cols = self.getColumns();
                self.domTemplate = self.wrapFlyoutContent(cols, tabTmpl)
            }
        }
        return self.domTemplate
    };
    this.createDomElements = function createDomElements_Flyout() {
        domAttachmentPoint = jQuery(document.createElement("DIV"));
        domAttachmentPoint.appendDom(self.getDomTemplate())
    };
    this.getDomElements = function getDomElements_Flyout() {
        if (!domAttachmentPoint) {
            self.createDomElements()
        }
        return (domAttachmentPoint.get(0))
    };
    this.getLinkGroupTemplates = function getLinkGroupTemplates() {
        var flyoutChildren = self.rootElement.childNodes;
        var linkGroups = [],
            linkGroupTemplate;
        for (var i = 0, len = flyoutChildren.length; i < len; i++) {
            var linkGroupData = flyoutChildren[i];
            var headerNode = linkGroupData;
            if (headerNode.isLink()) {
                self.refValues.menuOrder++
            }
            var childLinkTemplates = [];
            for (var j = 0, len2 = headerNode.childNodes.length; j < len2; j++) {
                var childNode = headerNode.childNodes[j];
                if (childNode.isLink()) {
                    self.refValues.menuOrder++
                }
                childLinkTemplates.push({
                    tagName: "li",
                    childNodes: [childNode.getDomTemplate()]
                })
            }
            var treeStatus = "leaf";
            if (childLinkTemplates.length > 0) {
                linkGroupTemplate = [headerNode.getDomTemplate("parent")];
                treeStatus = "branch";
                linkGroupTemplate.push({
                    tagName: "ul",
                    className: "children",
                    childNodes: childLinkTemplates
                })
            } else {
                linkGroupTemplate = [headerNode.getDomTemplate()]
            }
            linkGroups.push({
                tagName: "li",
                className: treeStatus,
                childNodes: linkGroupTemplate
            })
        }
        return linkGroups
    };
    this.getColumns = function getColumns() {
        var columns = [];
        var linkGroups = self.getLinkGroupTemplates();
        var start = 0,
            end;
        var columnCounts = this.counts;
        var columnClasses = this.structure.columnClasses || [];
        for (var i = 0, len = columnCounts.length; i < len; i++) {
            var end = start + columnCounts[i];
            var columnClass = columnClasses[i];
            var divClass = "gn_col";
            if (columnClass) {
                divClass = columnClass
            }
            if (i == len - 1) {
                divClass += " last-child"
            }
            columns.push({
                tagName: "div",
                className: divClass,
                childNodes: [{
                    tagName: "ul",
                    childNodes: linkGroups.slice(start, end)
                }]
            });
            start = end
        }
        return columns
    };
    this.wrapFlyoutContent = function wrapFlyoutContent(flybodyContent, flytabContent) {
        var flyoutType = self.type;
        var flyoutClass = this.structure.flyoverClass || "";
        if (flybodyContent.length > 1 && !flyoutClass.match("col")) {
            flyoutClass += " col" + flybodyContent.length
        }
        flytabContent = [flytabContent];
        var shadowInnerHtml = '<div class="gn_tl"></div><div class="gn_tr"></div><div class="gn_bl"></div><div class="gn_br"></div>';
        flybodyContent.unshift({
            tagName: "div",
            className: "gn_shadow",
            innerHTML: shadowInnerHtml
        });
        flytabContent.unshift({
            tagName: "div",
            className: "gn_shadow",
            innerHTML: shadowInnerHtml
        });
        var flyoutDomStructure = {
            tagName: "div",
            id: "gn_" + flyoutType + "fly_" + this.flyoutNumber,
            className: "gn_fly " + flyoutType + " " + flyoutClass,
            childNodes: [{
                tagName: "div",
                className: "gn_flytab",
                childNodes: flytabContent
            },
            {
                tagName: "div",
                className: "gn_flybody",
                childNodes: flybodyContent
            }]
        };
        return flyoutDomStructure
    };
    this.getColumnsC = function getColumnsC() {
        var columns = [];
        var columnCounts = self.counts;
        var columnClasses = self.structure.columnClasses || [];
        var linkGroups = self.getLinkGroupTemplates();
        var start = 0,
            end;
        for (var i = 0; i < columnCounts.length; i++) {
            var end = start + columnCounts[i];
            var columnClass = columnClasses[i];
            var divClass, ulClass = "menu";
            if (columnClass) {
                divClass = ulClass = columnClass
            }
            columns.push({
                tagName: "ul",
                className: ulClass,
                childNodes: linkGroups.slice(start, end)
            });
            start = end
        }
        return columns
    };
    this.wrapFlyoutContentC = function wrapFlyoutContentC(content) {
        var columnCount = self.counts.length;
        var cardinals = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
        var flyoutClass = "dd_" + cardinals[columnCount] + "_column";
        var baseId = "sc_tab" + (self.flyoutNumber);
        var flyoutTopDom = {
            tagName: "div",
            className: "round_top",
            id: baseId + "_top",
            childNodes: [{
                tagName: "div",
                className: "dd_shim",
                id: baseId + "_split"
            }]
        };
        var flyoutBottomDom = {
            tagName: "div",
            className: "round_footer",
            id: baseId + "_footer"
        };
        var flyoutInnerDiv = {
            tagName: "div",
            className: "flyoutInnerDiv",
            childNodes: content
        };
        var flyoutDomStructure = {
            tagName: "div",
            className: flyoutClass,
            id: baseId,
            childNodes: [flyoutTopDom,
            {
                tagName: "div",
                className: "container",
                id: baseId + "_container",
                childNodes: [flyoutInnerDiv]
            },
            flyoutBottomDom]
        };
        return flyoutDomStructure
    };
    return this
};

jQuery.fn.appendDom = function (template) {
    return this.each(function () {
        for (element in template) {
            var el = (typeof(template[element].tagName) === "string") ? document.createElement(template[element].tagName) : document.createTextNode("");
            delete template[element].tagName;
            for (attrib in template[element]) {
                if (attrib == "className") {
                    jQuery(el).addClass(template[element][attrib]);
                    delete template[element].className
                }
                switch (typeof(template[element][attrib])) {
                case "string":
                    if (typeof(el[attrib]) === "string") {
                        el[attrib] = template[element][attrib]
                    } else {
                        el.setAttribute(attrib, template[element][attrib])
                    }
                    break;
                case "function":
                    el[attrib] = template[element][attrib];
                    break;
                case "object":
                    if (attrib === "childNodes") {
                        jQuery(el).appendDom(template[element][attrib])
                    }
                    break
                }
            }
            this.appendChild(el)
        }
    })
};

(function ($) {
    jQuery.fn.accessibleClick = function (functionToCall, options) {
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).accessibleClick(functionToCall, options)
            }
            return this
        }
        if (this.length < 1) {
            return this
        }
        var enableKeyDown = (options) ? options.disableKeyDown || false : false;
        var accessibleClick = this;
        this.data("active", false);
        this.initialize = function () {
            this.hover(function () {
                accessibleClick.data("active", true)
            }, function () {
                accessibleClick.data("active", false)
            }).keydown(function () {
                if (enableKeyDown) {
                    accessibleClick.data("active", true)
                }
            }).keyup(function () {
                window.setTimeout(function () {
                    if (enableKeyDown) {
                        accessibleClick.data("active", false)
                    }
                }, 1)
            }).click(function (event, data) {
                var isUserClick = data && (typeof data.isUserClick == "boolean") ? data.isUserClick : true;
                if (isUserClick && accessibleClick.data("active") != true) {
                    return true
                }
                if (typeof functionToCall == "function") {
                    functionToCall.apply(accessibleClick, arguments)
                }
                return false
            })
        };
        return this.initialize()
    }
})(jQuery);


GVAR.env.ua = function () {
    var o = {
        ie: 0,
        opera: 0,
        gecko: 0,
        webkit: 0,
        mobile: null,
        air: 0,
        caja: 0
    },
        ua = navigator.userAgent,
        m;
    if ((/KHTML/).test(ua)) {
        o.webkit = 1
    }
    m = ua.match(/AppleWebKit\/([^\s]*)/);
    if (m && m[1]) {
        o.webkit = parseFloat(m[1]);
        if (/ Mobile\//.test(ua)) {
            o.mobile = "Apple"
        } else {
            m = ua.match(/NokiaN[^\/]*/);
            if (m) {
                o.mobile = m[0]
            }
        }
        m = ua.match(/AdobeAIR\/([^\s]*)/);
        if (m) {
            o.air = m[0]
        }
    }
    if (!o.webkit) {
        m = ua.match(/Opera[\s\/]([^\s]*)/);
        if (m && m[1]) {
            o.opera = parseFloat(m[1]);
            m = ua.match(/Opera Mini[^;]*/);
            if (m) {
                o.mobile = m[0]
            }
        } else {
            m = ua.match(/MSIE\s([^;]*)/);
            if (m && m[1]) {
                o.ie = parseFloat(m[1])
            } else {
                m = ua.match(/Gecko\/([^\s]*)/);
                if (m) {
                    o.gecko = 1;
                    m = ua.match(/rv:([^\s\)]*)/);
                    if (m && m[1]) {
                        o.gecko = parseFloat(m[1])
                    }
                }
            }
        }
    }
    m = ua.match(/Caja\/([^\s]*)/);
    if (m && m[1]) {
        o.caja = parseFloat(m[1])
    }
    return o
}();

/*
 * target.textResizeDetector @author Lenny Burdette lburdette@schematic.com
 * @fileoverview Rewritten text resize detector to remove jQuery dependency.
 * Doesn't work in Opera. @usage
 * 
 * target.textResizeDetector.init("id-of-dom-element", function(event,
 * initialSize) { event.subscribe(textSizeChangeHandler); });
 * 
 * Previous license:
 * 
 * Copyright (c) 2008 Tom Deater (http://www.tomdeater.com) Licensed under the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 * 
 * Renamed to "onTextResize" for a more descriptive name Modified to check if
 * the browser either zooms or text-resizes (Does not fire if browser uses zoom)
 * 
 * uses an iframe, sized in ems, to detect text size changes then trigger a
 * "textresize" event heavily based on code by Hedger Wang:
 * http://www.hedgerwow.com/360/dhtml/js-onfontresize.html
 * 
 * "textresize" event is triggered on the document object subscribe to event
 * using: $(document).bind("textresize", function (event, data) {}); "data"
 * contains the current size of 1 em unit (in pixels)
 * 
 */
window.target = window.target || {};
target.textResizeDetector = function () {
    var Y = GVAR,
        E = Y.util.Event,
        UA = Y.env.ua;
    if (UA.opera) {
        return null
    }
    var fontSizeChangeEvent = new GVAR.util.CustomEvent("fontsizechange");
    var eventPath = "target.textResizeDetector.event";
    var iframe;
    var size = {};
    var sizePath = "target.textResizeDetector.setSize";

    function init(container, callback) {
        createIframe(container);
        addBehavior();
        callback(fontSizeChangeEvent, size)
    }
    function createIframe(container) {
    /*
        iframe = document.createElement("iframe");
        iframe.src = "/iframe.ajax";
        iframe.id = "frame-onTextResize" + new Date().getTime();
        iframe.title = "empty";
        iframe.frameborder = 0;
        var style = {
            width: "100em",
            height: "10px",
            position: "absolute",
            borderWidth: 0,
            top: "-9999px",
            left: "-9999px"
        };
        for (var prop in style) {
            iframe.style[prop] = style[prop]
        }
        container.appendChild(iframe)
    */
    }
    function addBehavior() {
    	/*
    	if (UA.ie) {
            E.on(iframe, "resize", onFontSizeChange)
        } else {
            var doc = iframe.contentWindow || iframe.contentDocument || iframe.document;
            doc = doc.document || doc;
            var iwindow = iframe.contentWindow;
            var s = 'style="width:100%;height:100%;padding:0;margin:0;overflow:hidden;"';
            doc.open();
            doc.write("<html " + s + "><body " + s + "></body></html>");
            doc.close();
            E.on(iwindow, "resize", onFontSizeChange)
        }
        size = iframe.offsetWidth / 100
        */
    }
    function onFontSizeChange() {
        size = iframe.offsetWidth / 100;
        fontSizeChangeEvent.fire(size)
    }
    return {
        init: function (id, callback) {
            E.onAvailable(id, function () {
                init(document.getElementById(id), callback)
            })
        },
        event: fontSizeChangeEvent,
        getSize: function () {
            return size
        },
        setSize: function (newSize) {
            size = newSize
        }
    }
}();

target = window.target || {};
target.NAV = target.NAV || {};
target.NAV.Flyouts = target.NAV.Flyouts || {};
(function () {
    var Y = GVAR,
        D = Y.util.Dom,
        E = Y.util.Event,
        UA = Y.env.ua,
        Flyouts = target.NAV.Flyouts;
    var positionParent;
    var timeout;
    var PX = "px";
    Flyouts.create = function (parent, type, fontSize, topPaddingFix) {
        positionParent = positionParent || document.getElementById("gn");
        type = type ? type : "Main";
        var instance = new Flyouts[type](parent, fontSize, topPaddingFix);
        if (!instance.invalid) {
            return instance
        }
    };
    Flyouts.Main = function (parent, fontSize, topPaddingFix) {
        var split = parent.id.split("_");
        var index = split[2] - 1;
        target.ui.gn.flyoutsController.buildFlyout("Main", index);
        this.parent = parent;
        this.el = document.getElementById(parent.id.replace("main", "mainfly"));
        this.fontSize = fontSize;
        this.topPaddingFix = topPaddingFix;
        if (this.el) {
            if (window.sc && sc.incat && sc.incat.url) {
                jQuery("a", this.el).each(function () {
                    sc.sellerCentralLinks(this)
                })
            }
        } else {
            this.invalid = true;
            return
        }
        this.setup()
    };
    Flyouts.Main.prototype = {
        setup: function () {
            this.label = this.el.getElementsByTagName("div")[0];
            this.body = D.getElementsByClassName("gn_flybody", "div", this.el)[0];
            this.fixSize();
            this.addBehavior()
        },
        setPosition: function () {
            showShim(this);
            zeId = this.el.id;
            if (zeId.indexOf("header") > -1)
            {
            	if (jQuery.browser.msie && jQuery.browser.version == '6.0')
            	{
                	D.setXY(this.el, [this.xPos, this.yPos - 13])
            	}		
            	else
            	{
            		D.setXY(this.el, [this.xPos, this.yPos - 5])
            	}
            } 
            else if (zeId.indexOf("gnl") > -1)
            {
            	if (jQuery.browser.msie && jQuery.browser.version == '6.0')
            	{
                	D.setXY(this.el, [this.xPos, this.yPos - 25])
            	}		
            	else
            	{
                	D.setXY(this.el, [this.xPos, this.yPos - 7])
            	}
            }
            else if (zeId.indexOf("mn") > -1)
            {
            	if (jQuery.browser.msie && jQuery.browser.version == '6.0')
            	{
                	D.setXY(this.el, [this.xPos, this.yPos - 13])
            	}		
            	else
            	{
                	D.setXY(this.el, [this.xPos, this.yPos - 5])
            	}
            }
            else
            {
                D.setXY(this.el, [this.xPos, this.yPos])
            }
        },
        fixSize: function () {
            zeId = this.el.id;
            this.labelWidth = this.parent.offsetWidth + this.options.labelWidthAdjust;
            this.label.style.width = this.labelWidth + PX;
            this.labelHeight = this.parent.offsetHeight + this.options.labelHeightAdjust;
            
            this.label.style.height = this.labelHeight + PX;
            this.label.style.top = -this.labelHeight + this.options.labelTopAdjust + PX;

            //alert (this.label.style.height + ":" + this.label.style.top);
            if (this.fontSize) {
                this.label.getElementsByTagName("a")[0].style.fontSize = this.fontSize + PX
            }
            if (this.topPaddingFix) {
                this.label.getElementsByTagName("a")[0].style.paddingTop = this.topPaddingFix + PX
            }
            if (this.labelWidth >= this.body.offsetWidth) {
                if (zeId.indexOf("gnl") > -1)
                {
                	this.body.style.width = this.labelWidth + 5 + PX
                }
                else
                {
                	this.body.style.width = this.labelWidth + 13 + PX
                }
            }
        },
        options: {
            xOffset: 0,
            yOffset: 0,
            labelWidthAdjust: 0,
            labelHeightAdjust: 0,
            labelTopAdjust: 0,
            labelLeftAdjust: 0
        },
        addBehavior: function () {
            E.on(this.el, "mouseover", onMouseOver, this);
            E.on(this.el, "mouseout", onMouseLeave, this)
        },
        getPosition: function () {
            var p = D.getXY(this.parent);
            this.xPos = p[0] + this.options.xOffset;
            this.yPos = p[1] + this.options.yOffset + this.label.offsetHeight
        },
        fixFlyout: function () {
            flip(this);
            if (!this.fixed) {
                this.fixed = true;
                columnHeightFix(this);
                ieShadows(this)
            }
        },
        show: function () {
            clearTimeout(timeout);
            if (this.el) {
                this.getPosition();
                this.fixFlyout(this);
                this.setPosition()
            }
        },
        hide: function () {
            clearTimeout(timeout);
            if (this.el) {
                this.el.style.left = "-9999px";
                this.el.style.top = "-9999px";
                hideShim()
            }
        },
        focus: function () {
            this.label.getElementsByTagName("a")[0].focus()
        },
        reset: function () {
            this.label.setAttribute("style", "");
            D.removeClass(this.el, "right");
            D.removeClass(this.el, "middle");
            resetColumnHeights(this)
        }
    };
    Flyouts.Sub = function (parent) {
        var split = parent.id.split("_");
        var index = split[2] - 1;
        target.ui.gn.flyoutsController.buildFlyout("Sub", index);
        this.parent = parent;
        this.el = document.getElementById(parent.id.replace("sub", "subfly"));
        if (this.el) {
            if (window.sc && sc.incat && sc.incat.url) {
                jQuery("a", this.el).each(function () {
                    sc.sellerCentralLinks(this)
                })
            }
        } else {
            this.invalid = true;
            return
        }
        this.setup()
    };
    Flyouts.Sub.prototype = {};
    Y.extend(Flyouts.Sub, Flyouts.Main, {
        options: {
            xOffset: 0,
            yOffset: 0,
            labelWidthAdjust: 0,
            labelHeightAdjust: -5,
            labelTopAdjust: 4,
            labelLeftAdjust: 0
        },
        fixFlyout: function () {
            reposition(this);
            if (!this.fixed) {
                this.fixed = true;
                columnHeightFix(this);
                ieShadows(this)
            }
        }
    });
    Flyouts.Special = function (parent) {
        this.parent = parent;
        this.el = document.getElementById(parent.id.replace("l2", "l2dd"));
        this.link = this.parent.getElementsByTagName("a");
        if (this.link.length) {
            this.link = this.link[0];
            this.offsets = this.link.rel.split("x");
            this.offsets[0] = parseInt(this.offsets[0], 10);
            this.offsets[1] = parseInt(this.offsets[1], 10)
        }
        if (this.el) {
            if (window.sc && sc.incat && sc.incat.url) {
                jQuery("a", this.el).each(function () {
                    sc.sellerCentralLinks(this)
                })
            }
        } else {
            this.invalid = true;
            return
        }
        this.setup()
    };
    Flyouts.Special.prototype = {
        setup: function () {
            E.on(this.el, "mouseover", onMouseOver, this);
            E.on(this.el, "mouseout", onMouseLeave, this)
        },
        show: function () {
            if (this.el) {
                D.addClass(this.el, "show");
                D.addClass(this.parent, "gn_over");
                this.getPosition();
                this.addLabelShim();
                this.setPosition();
                showShim(this)
            }
        },
        hide: function () {
            if (this.el) {
                D.removeClass(this.el, "show");
                D.removeClass(this.parent, "gn_over");
                hideShim(this)
            }
        },
        getPosition: function () {
            var p = D.getXY(this.parent);
            this.xPos = p[0] + this.offsets[0];
            this.yPos = p[1] + this.offsets[1];
        },
        setPosition: function () {
            this.el.style.left = this.xPos + PX;
            this.el.style.top = this.yPos + PX;
        },
        addLabelShim: function () {
            if (!this.labelShim) {
                var shim = document.createElement("a");
                shim.href = this.parent.getElementsByTagName("a")[0].href;
                shim.className = "gn_special_shim";
                shim.style.width = this.parent.offsetWidth + PX;
                shim.style.height = this.parent.offsetHeight + 6 + PX;
                shim.style.top = -this.parent.offsetHeight - 6 + PX;
                shim.style.left = D.getX(this.parent) - this.xPos + PX;
                this.el.appendChild(shim);
                this.labelShim = true
            }
        },
        reset: function () {}
    };

    function onMouseOver(e, flyout) {
        clearTimeout(timeout)
    }
    function onMouseLeave(e, flyout) {
        var parent = E.getRelatedTarget(e);
        while (parent && parent != this) {
            parent = parent.parentNode
        }
        if (parent != this) {
            timeout = setTimeout(function () {
                flyout.hide()
            }, 250)
        }
    }
    function maximumRight() {
    	positionParent = positionParent || document.getElementById("menu_bar_shadow");
        return D.getXY(positionParent)[0] + positionParent.offsetWidth
    }
    function flip(flyout) {
        var width = flyout.body.offsetWidth;
        if (flyout.xPos + width > maximumRight()) {
            setTabPosition(flyout, "right")
        }
    }
    function reposition(flyout) {
        var width = flyout.el.offsetWidth;
        var max = maximumRight();
        if (flyout.xPos + width > max) {
            setTabPosition(flyout, flyout.xPos + width - max)
        }
    }
    function setTabPosition(flyout, position) {
        var moveTabLeftBy = 0,
            rightAligned = flyout.el.offsetWidth - flyout.label.offsetWidth,
            alignment;
        if (position === "right" || position >= rightAligned - 5) {
            moveTabLeftBy = rightAligned;
            alignment = "right"
        } else {
            if (position > 0) {
                alignment = "middle";
                moveTabLeftBy = position
            } else {
                return
            }
        }
        D.addClass(flyout.el, alignment);
        flyout.label.style.left = moveTabLeftBy + "px";
        flyout.xPos -= moveTabLeftBy
    }
    function columnHeightFix(flyout) {
        findColumns(flyout);
        if (flyout.moreCol && flyout.moreCol.offsetHeight < flyout.tallest) {
            var h = flyout.tallest + "px";
            for (var i = -1, node; node = flyout.columns[++i];) {
                node.style.height = h
            }
        }
    }
    function findColumns(flyout) {
        if (flyout.columns) {
            return
        }
        var cols = [],
            tallest, moreCol, child;
        child = flyout.body.firstChild;
        tallest = 0;
        do {
            if (child.nodeType === 1 && child.className.indexOf("gn_col") > -1) {
                cols[cols.length] = child;
                if (child.className.indexOf("gn_more") > -1) {
                    moreCol = child
                } else {
                    if (child.offsetHeight >= tallest) {
                        tallest = child.offsetHeight
                    }
                }
            }
        } while (child = child.nextSibling);
        flyout.columns = cols;
        flyout.tallest = tallest;
        flyout.moreCol = moreCol
    }
    function resetColumnHeights(flyout) {
        if (flyout.columns) {
            for (var i = -1, node; node = flyout.columns[++i];) {
                node.style.height = "auto"
            }
        }
    }
    function ieShadows(flyout) {
        if (!UA.ie) {
            return
        }
        var body = flyout.body,
            label = flyout.label,
            bodyShadow = D.getElementsByClassName("gn_shadow", "div", body)[0],
            tabShadow = D.getElementsByClassName("gn_shadow", "div", label)[0];
        if (UA.ie > 6 || document.compatMode == "CSS1Compat") {
            oddNumberedSizing(bodyShadow, body.offsetWidth, body.offsetHeight);
            oddNumberedSizing(tabShadow, label.offsetWidth, label.offsetHeight);
            var bodyEven = body.offsetWidth % 2 === 0,
                labelEven = label.offsetWidth % 2 === 0;
            if (D.hasClass(flyout.el, "right")) {
                if (bodyEven && labelEven) {} else {
                    if (bodyEven) {
                        body.style.left = -1 + PX
                    } else {
                        if (labelEven) {
                            body.style.left = 1 + PX
                        }
                    }
                }
            }
        } else {
            bodyShadow.style.width = body.offsetWidth + 11 + PX;
            bodyShadow.style.height = body.offsetHeight + 10 + PX;
            tabShadow.style.width = label.offsetWidth + 11 + PX;
            tabShadow.style.height = label.offsetHeight + 10 + PX;
            if (D.hasClass(flyout.el, "right")) {
                var bodyEven = body.offsetWidth % 2 === 0,
                    labelEven = label.offsetWidth % 2 === 0;
                if (bodyEven && labelEven) {} else {
                    if (bodyEven) {
                        body.style.left = 1 + PX
                    } else {
                        if (labelEven) {
                            body.style.left = -1 + PX
                        }
                    }
                }
            }
        }
    }
    function oddNumberedSizing(el, w, h) {
        el.style.width = (w % 2 ? w - 1 : w) + PX;
        el.style.height = (h % 2 ? h - 1 : h) + PX
    }
    var iframe, K = function () {},
        ie6 = (UA.ie && UA.ie < 7);

    function ieSupport() {
    	iframe = document.createElement("iframe");
        iframe.className = "gn_shim";
        iframe.src = "/iframe.ajax";
        iframe.title = "empty";
        iframe.border = 0;
       // document.body.appendChild(iframe)
    }
    Flyouts.ieSupport = ie6 ? ieSupport : K;
    var showShim = ie6 ?
    function (flyout) {
        D.setXY(iframe, [flyout.xPos, flyout.yPos]);
        iframe.style.zIndex = 80;
        iframe.style.position = 'absolute';
        iframe.style.height = '350px'
        iframe.style.width = '390px';
    } : K;
    var hideShim = ie6 ?
    function (flyout) {
        iframe.style.left = "-9999px";
        iframe.style.top = "-9999px"
    } : K
}());

jQuery(document).ready(function call_FlyoutsController_build() {
    var controller = target.ui.gn.flyoutsController;
    controller.build.call(controller)
});
target.ui.gn.flyoutsController = {
    flyoutsAttachmentPoint: {},
    incatsRootNode: {},
    supercatsRootNode: {},
    checkDependencies: true,
    initialized: false,
    globalUrlParams: "",
    init: function init_flyoutsController() {
        if (this.initialized !== true) {
            if (this.checkDependencies && !this.dependenciesOk()) {
                return false
            }
        }
        this.initialized = true;
        return this.initialized
    },
    build: function build_flyoutsController() {
        try {
            var initOk = this.init();
            if (initOk === false) {
                return
            }
            var cfg = {
                flyoutsAttachmentPointSelector: "#gn_fly",
                supercatsTabsSelector: "#gn_main li",
                supercatsTabsHighlightClass: "gn_active",
                incatsRowSelector: "#gn_sub",
                preserveParams: {
                    releaseID: 1,
                    customerID: 1,
                    sc_server_name: 1,
                    weblab: 1
                },
                searchCategorySelector: "gn_search_scope"
            };
            if (!target.ui.gn.data) {
                if (window.console && console.error) {
                    console.error("can't find menu data")
                }
                return
            }
            var addedParams = [];
            if (window.location.search) {
                var searchString = "";
                if (window.location.search.charAt(0) == "?") {
                    searchString = window.location.search.substring(1, window.location.search.length)
                } else {
                    searchString = window.location.search
                }
                if (searchString && searchString.length > 0) {
                    var keyValues = searchString.split("&");
                    if (keyValues.length > 0) {
                        for (var i = 0; i < keyValues.length; i++) {
                            var kvPair = keyValues[i].split("=");
                            if (kvPair.length == 2) {
                                if (cfg.preserveParams[kvPair[0]]) {
                                    addedParams.push(keyValues[i])
                                }
                            }
                        }
                    }
                }
            }
            this.globalUrlParams = addedParams.join("&");
            this.setDefaultSearch(cfg.searchCategorySelector);
            var supercats = target.ui.gn.data.supercats;
            if (supercats) {
                this.supercatsRootNode = new target.ui.gn.Node(supercats.data, {
                    recurse: 1,
                    addedUrlParams: this.globalUrlParams
                });
                this.highlightSupercatTab(this.supercatsRootNode, cfg.supercatsTabsSelector, cfg.supercatsTabsHighlightClass)
            }
            var incat = target.ui.gn.incat;
            if (incat) {
                var incatObject = target.ui.gn.data.incat;
                if (incatObject) {
                    this.incatsRootNode = new target.ui.gn.Node(incatObject.data, {
                        recurse: 1,
                        addedUrlParams: this.globalUrlParams
                    }, incat);
                    this.populateIncatsRow(this.incatsRootNode, cfg.incatsRowSelector);
                    target.NAV.initFlyouts()
                }
            }
            if (typeof(cfg.flyoutsAttachmentPointSelector) != "undefined") {
                this.flyoutsAttachmentPoint = jQuery(cfg.flyoutsAttachmentPointSelector)
            }
            if (this.flyoutsAttachmentPoint.length == 0) {
                var newElement = document.createElement("div");
                newElement.setAttribute("id", "gn_fly");
                jQuery("body").append(newElement);
                this.flyoutsAttachmentPoint = jQuery(newElement)
            }
        } catch (e) {
            if (window.console && console.error) {
                console.error("could not build global nav flyouts: ", e)
            }
        }
    },
    buildFlyout: function buildSingleFlyout(type, index) {
        var rootNode;
        var dataSource;
        if (type == "Main") {
            dataSource = target.ui.gn.data.supercats;
            rootNode = this.supercatsRootNode;
            type = "main"
        } else {
            var incat = target.ui.gn.incat;
            var incatObject = target.ui.gn.data.incat;
            if (incatObject) {
                dataSource = incatObject;
                rootNode = this.incatsRootNode;
                type = "sub"
            }
        }
        if (dataSource && rootNode) {
            var data = dataSource.data.children[index];
            var structure = dataSource.structure[index];
            var node = new target.ui.gn.Node(data, {
                parentNode: rootNode,
                siblingNumber: index + 1,
                flyoutNumber: index + 1,
                menuOrder: {
                    counter: 0
                },
                recurse: 10,
                addedUrlParams: this.globalUrlParams
            });
            var flyout = new target.ui.gn.Flyout(node, structure, index, type);
            if (flyout && flyout.getDomTemplate) {
                var domTemplate = flyout.getDomTemplate();
                if (domTemplate) {
                    this.flyoutsAttachmentPoint.appendDom([domTemplate])
                }
            }
        }
    },
    highlightSupercatTab: function highlightSupercatTab(root, tabsSelector, highlightClass) {
        incat = target.ui.gn.incat;
        if (!root || !incat) {
            return
        }
        var childNodes = root.childNodes;
        for (var i = 0, len = childNodes.length; i < len; i++) {
            if (incat == "icn_" + childNodes[i].location) {
                jQuery(tabsSelector).eq(i).addClass(highlightClass).prepend("<span></span>");
                return
            }
        }
    },
    setDefaultSearch: function setDefaultSearch(categorySelector) {
        target.NAV.initSearch();
        incat = target.ui.gn.incat;
        if (!categorySelector || !incat) {
            return
        }
        var categoryObject = document.getElementById(categorySelector);
        var selectedCategory = categoryObject.options[categoryObject.selectedIndex];
        var selectedNodeId = selectedCategory.value;
        if (selectedNodeId == "1038576|1287991011") {
            $("#" + categorySelector + "> option").each(function (index) {
                if ("icn_" + $(this).attr("value") == incat) {
                    categoryObject.setIndex(index)
                }
            })
        }
    },
    populateIncatsRow: function populateIncatsRow(root, rowSelector) {
        if (!root) {
            return
        }
        var childTemplates = [];
        var childNodes = root.childNodes;
        var itemId, itemClass;
        for (var i = 0, len = childNodes.length; i < len; i++) {
            var child = childNodes[i];
            child.flyoutNumber = i + 1;
            var linkTmpl = child.getDomTemplate();
            itemClass = "";
            if (child.isParent()) {
                itemId = "gn_sub_" + (i + 1)
            } else {
                itemClass = "noFlyout ";
                itemId = ""
            }
            if (i == 0) {
                itemClass += "first-child"
            } else {
                if (i == len - 1) {
                    itemClass += "last-child"
                }
            }
            childTemplates.push({
                tagName: "li",
                id: itemId,
                className: itemClass,
                childNodes: [linkTmpl]
            })
        }
        var template = [{
            tagName: "ul",
            childNodes: childTemplates
        }];
        jQuery(rowSelector).appendDom(template)
    },
    dependenciesOk: function dependenciesOk() {
        try {
            return (document && document.getElementById && jQuery && jQuery.fn.appendDom)
        } catch (e) {
            return false
        }
    }
};

target = window.target || {};
target.NAV = target.NAV || {};
(function () {
    var Y = GVAR,
        D = Y.util.Dom,
        E = Y.util.Event,
        UA = Y.env.ua,
        ARIA = target.NAV.ARIA;
    target.NAV.ComboBox = function () {
        var realBox, box, list, data = [],
            items = [],
            currentIndex, timeout;

        function createHTML(that) {
            that.box = document.createElement("div");
            that.box.className = "combo";
            that.box.setAttribute("role", "combobox");
            that.box.tabIndex = 0;
            that.label = document.createElement("span");
            that.label.className = "label";
            that.box.appendChild(that.label);
            that.list = document.createElement("ul");
            that.box.appendChild(that.list);
            var options = that.realBox.getElementsByTagName("option");
            for (var i = -1, node, newNode; node = options[++i];) {
                that.data[i] = node.innerHTML;
                newNode = document.createElement("li");
                newNode.innerHTML = that.data[i];
                if (node.selected) {
                    newNode.className = "checked";
                    that.currentIndex = i;
                    that.label.innerHTML = that.data[i];
                    that.box.setAttribute("aria-valuenow", that.data[i])
                }
                that.items[i] = newNode;
                that.list.appendChild(newNode)
            }
            D.addClass(that.realBox, "hidden");
            that.realBox.parentNode.insertBefore(that.box, that.realBox);
            addAssistance(that)
        }
        function addAssistance(that) {
            if (!ARIA) {
                that.assist = document.createElement("a");
                that.assist.href = "#";
                that.assist.className = "gn_access";
                that.assist.innerHTML = "Click here to select search options";
                that.realBox.parentNode.insertBefore(that.assist, that.box);
                E.on(that.assist, "click", onAssist, that)
            }
        }
        function addBehavior(that) {
            E.on(that.box, "keydown", handleKey, that);
            E.on(that.box, "keyup", cancelKey, that);
            E.on(that.box, "click", onClick, that);
            E.on(that.items, "click", onSelect, that);
            if (UA.ie) {
                that.box.onmouseup = function () {
                    hideOptions(that)
                };
                that.box.onmouseover = function () {
                    D.addClass(window.event.srcElement, "hover")
                };
                that.box.onmouseout = function () {
                    D.removeClass(window.event.srcElement, "hover")
                }
            }
        }
        function handleKey(event, that) {
            switch (event.keyCode) {
            case 38:
            case 37:
                E.preventDefault(event);
                repeatActionWithDelay(prev, that);
                break;
            case 40:
            case 39:
                E.preventDefault(event);
                repeatActionWithDelay(next, that);
                break;
            case 13:
            case 32:
                E.preventDefault(event);
                hideOptions(that);
                break;
            default:
                break
            }
        }
        function repeatActionWithDelay(action, that) {
            if (action) {
                action(that);
                clearInterval(timeout);
                timeout = setTimeout(function () {
                    clearInterval(timeout);
                    timeout = setInterval(function () {
                        action(that)
                    }, 100)
                }, 250)
            }
        }
        function cancelKey(event, that) {
            E.preventDefault(event);
            clearInterval(timeout)
        }
        function onClick(event, that) {
            E.stopPropagation(event);
            showOptions(that)
        }
        function onSelect(event, that) {
            E.stopPropagation(event);
            for (var i = -1, node; node = that.items[++i];) {
                if (node === this) {
                    setIndex(that, i);
                    hideOptions(that);
                    break
                }
            }
        }
        function onAssist(event, that) {
            E.preventDefault(event);
            D.removeClass(that.realBox, "hidden");
            D.setStyle(that.box, "display", "none");
            that.realBox.focus()
        }
        function onOptionsCancel(event, that) {
            hideOptions(that)
        }
        function stopHover(event) {
            event.stopPropagation()
        }
        function showOptions(that) {
            D.addClass(that.box, "active");
            E.on(document.body, "click", onOptionsCancel, that);
            fixZIndex(that);
            if (that.activateCallback) {
                that.activateCallback()
            }
            try {
                document.addEventListener("mouseover", stopHover, true)
            } catch (e) {
                that.box.setCapture()
            }
        }
        function hideOptions(that) {
            D.removeClass(that.box, "active");
            E.removeListener(document.body, "click", onOptionsCancel);
            resetZIndex(that);
            try {
                document.removeEventListener("mouseover", stopHover, true)
            } catch (e) {
                that.box.releaseCapture()
            }
        }
        function fixZIndex(that) {
            if (UA.ie && that.positionParent) {
                that.realZ = that.positionParent.style.zIndex;
                that.positionParent.style.zIndex = 10000
            }
        }
        function resetZIndex(that) {
            if (UA.ie && that.positionParent && !isNaN(parseInt(that.realZ))) {
                that.positionParent.style.zIndex = that.realZ
            }
        }
        function next(that) {
            if (that.currentIndex + 1 < that.data.length) {
                that.currentIndex = setIndex(that, that.currentIndex + 1)
            }
        }
        function prev(that) {
            if (that.currentIndex > 0) {
                that.currentIndex = setIndex(that, that.currentIndex - 1)
            }
        }
        function setIndex(that, index) {
            for (var i = -1, node; node = that.items[++i];) {
                if (i === index) {
                    D.addClass(node, "checked");
                    that.label.innerHTML = that.data[i];
                    that.box.setAttribute("aria-valuenow", that.data[i]);
                    that.realBox.selectedIndex = i
                } else {
                    D.removeClass(node, "checked")
                }
            }
            return index
        }
        function Box(real, activateCallback, positionParent) {
            this.realBox = real;
            this.activateCallback = activateCallback;
            this.positionParent = positionParent;
            this.items = [];
            this.data = [];
            createHTML(this);
            addBehavior(this);
            var box = this;
            real.setIndex = function (index) {
                setIndex(box, index)
            }
        }
        return {
            create: function (real, activateCallback, positionParent) {
                return new Box(real, activateCallback, positionParent)
            }
        }
    }()
}());
(function () {
    var Y = GVAR,
        D = Y.util.Dom,
        E = Y.util.Event,
        UA = Y.env.ua;
    var FOCUS = UA.ie ? "focusin" : "focus",
        BLUR = UA.ie ? "focusout" : "blur";
    var defaultLabelStore = {},
        forms = {};
    target.NAV.InlineLabel = {
        apply: function (input) {
            var label = findLabel(input);
            if (label) {
                applyBehavior(input, label)
            }
            var form = input.form;
            if (form) {
                storeForm(form)
            }
        }
    };

    function findLabel(input) {
        var labels = input.form.parentNode.getElementsByTagName("label");
        for (var i = -1, node; node = labels[++i];) {
            if (node.htmlFor === input.id) {
                return node
            }
        }
    }
    function applyBehavior(input, label) {
        defaultLabelStore[input.id] = label.innerHTML;
        if (input.value === "") {
            input.value = label.innerHTML
        }
        E.on(input, FOCUS, onFocus);
        E.on(input, BLUR, onBlur)
    }
    function onFocus(e) {
        var label = defaultLabelStore[this.id];
        if (label && this.value === label) {
            this.value = ""
        }
    }
    function onBlur(e) {
        if (this.value === "") {
            this.value = defaultLabelStore[this.id] || ""
        }
    }
    function storeForm(form) {
        if (!forms[form]) {
            forms[form] = new FixedForm(form)
        }
    }
    function FixedForm(form) {
        this.form = form;
        this.inputs = [];
        E.on(form, "submit", check, this)
    }
    function check(form) {
        form.check()
    }
    FixedForm.prototype = {
        check: function () {
            for (var i = -1, node; node = this.inputs[++i];) {
                var label = defaultLabelStore[node.id];
                if (label && node.value === label) {
                    node.value = ""
                }
            }
        }
    }
}());

target = window.target || {};
target.NAV = target.NAV || {};
(function () {
    var Y = GVAR,
        D = Y.util.Dom,
        E = Y.util.Event,
        UA = Y.env.ua,
        Flyouts = target.NAV.Flyouts,
        ComboBox = target.NAV.ComboBox;
    target.NAV.ARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8);
    var FOCUS = UA.ie ? "focusin" : "focus",
        BLUR = UA.ie ? "focusout" : "blur";
    E.onAvailable("gn_search_scope", initSearch);
    E.onAvailable("gn_main_fix", updateNav);
    E.onDOMReady(initFlyouts);
    var main, mainItems, sub, subItems, lists, listsItems, combobox, searchInput;
    var newFontSize = false,
        topPaddingFix, baseFontSize = 1.2,
        fontSizeFactor = 30,
        defaultPadding = 10;
    var flyouts = {};

    function initSearch() {
        if (typeof(initSearch.called) != "undefined") {
            return
        }
        initSearch.called = true;
        combobox = document.getElementById("gn_search_scope");
        if (combobox) {
            ComboBox.create(combobox, hideFlyouts, document.getElementById("gn"));
            searchInput = document.getElementById("gn_search_input");
            if (D.hasClass(searchInput.form.parentNode, "gn_below")) {
                target.NAV.InlineLabel.apply(searchInput)
            }
        }
    }
    target.NAV.initSearch = initSearch;

    function initFlyouts() {
        if (findElements()) {
            redrawSupercats();
            resizeDetector();
            addBehavior()
        } else {
            setTimeout(initFlyouts, 1000)
        }
    }
    target.NAV.initFlyouts = initFlyouts;

    function findElements() {
        main = document.getElementById("gn_main");
        if (!main) {
            return false
        }
        mainItems = main.getElementsByTagName("a");
        sub = document.getElementById("gn_sub");
        if (sub) {
            subItems = sub.getElementsByTagName("li")
        }
        lists = document.getElementById("gn_lists");
        if (lists) {
            listsItems = lists.getElementsByTagName("li")
        }
        return true
    }
    function addBehavior() {
        Flyouts.ieSupport();
        E.on(mainItems, "mouseover", onMouseOver, "Main");
        E.on(mainItems, "mouseout", killDelay);
        if (subItems && subItems.length > 0) {
            E.on(subItems, "mouseover", onMouseOver, "Sub");
            E.on(subItems, "mouseout", killDelay)
        }
        if (listsItems && listsItems.length > 0) {
            E.on(listsItems, "mouseover", onMouseOver, "Special");
            E.on(listsItems, "mouseout", killDelay)
        }
        E.on(document.body, "click", clickBody)
    }
    var delay;

    function onMouseOver(e, type) {
        clearTimeout(delay);
        var trigger = this;
        openFunc = function () {
            if (trigger.nodeName.toLowerCase() === "a") {
                trigger = trigger.parentNode
            }
            showFlyout(trigger, type)
        };
        delay = setTimeout(openFunc, 50)
    }
    function killDelay() {
        clearTimeout(delay)
    }
    function showFlyout(item, type, focusAfterShow) {
        hideFlyouts();
        if (D.hasClass(item, "gn_active")) {
            return
        }
        if (!flyouts[item.id]) {
            flyouts[item.id] = Flyouts.create(item, type, newFontSize, topPaddingFix)
        }
        if (flyouts[item.id]) {
            flyouts[item.id].show();
            if (focusAfterShow) {
                flyouts[item.id].focus()
            }
        }
    }
    function hideFlyouts() {
        for (var id in flyouts) {
            if (flyouts.hasOwnProperty(id) && flyouts[id]) {
                flyouts[id].hide()
            }
        }
        jQuery(".gn_level2_fly").css({'left' : '-9999px', 'top' : '-9999px'})
    }
    function clickBody(e) {
        var trigger = E.getTarget(e);
        while (trigger.parentNode) {
            if (trigger.id == "gn_fly" || trigger.id == "l2dd_giftfinder" || trigger.id == "l2dd_registry") {
                return
            }
            trigger = trigger.parentNode
        }
        hideFlyouts()
    }
    var baseSize = 10,
        currentSize;

    function resizeDetector(callback) {
        if (target.textResizeDetector) {
            target.textResizeDetector.init("gn", function (event, size) {
                currentSize = size;
                target.textResizeDetector.event.subscribe(onTextResize);
                reformatMainNav()
            })
        }
    }
    function onTextResize() {
        var newSize = target.textResizeDetector.getSize();
        if (currentSize !== newSize) {
            for (var id in flyouts) {
                if (flyouts.hasOwnProperty(id)) {
                    flyouts[id].reset();
                    flyouts[id] = null
                }
            }
            flyouts = {}
        }
        currentSize = newSize;
        reformatMainNav()
    }
    function reformatMainNav() {
        if (currentSize > baseSize) {
            D.addClass(main, "tooBig")
        } else {
            D.removeClass(main, "tooBig")
        }
    }
    function updateNav() {
        redrawSupercats();
        navWidths()
    }
    function redrawSupercats() {
        if (!target.ui.gn.redrawSupercats) {
            return
        }
        if (typeof(redrawSupercats.called) == "undefined") {
            redrawSupercats.called = true
        } else {
            return
        }
        if (target.ui.gn.data.supercats) {
            var supercats = target.ui.gn.data.supercats.data;
            var supercatsDiv = document.getElementById("gn_main");
            var incat = target.ui.gn.incat;
            var newList = document.createElement("ul");
            for (var i = 0; i < supercats.children.length; i++) {
                var linkNum = i + 1;
                var child = supercats.children[i];
                var newItem = document.createElement("li");
                newItem.setAttribute("id", "gn_main_" + linkNum);
                var className = "";
                if (i == 0) {
                    className += " first-child"
                }
                if (i == supercats.children.length - 1) {
                    className += " last-child"
                }
                if (incat == "icn_" + child.location) {
                    var emptySpan = document.createElement("span");
                    newItem.appendChild(emptySpan);
                    className += " gn_active"
                }
                if (className) {
                    newItem.setAttribute("class", className);
                    newItem.setAttribute("className", className)
                }
                var newLink = document.createElement("a");
                newLink.setAttribute("href", target.ui.gn.nonsecureserver + "/b/ref=nav_t_spc_" + linkNum + "_0?ie=UTF8&node=" + child.location);
                if (child.title) {
                    newLink.setAttribute("title", child.title)
                }
                newLink.innerHTML = child.text;
                newItem.appendChild(newLink);
                newList.appendChild(newItem)
            }
            var list = supercatsDiv.getElementsByTagName("ul")[0];
            supercatsDiv.insertBefore(newList, list);
            supercatsDiv.removeChild(list)
        }
    }
    function navWidths() {
        var main = document.getElementById("gn_main"),
            maxWidth = main.offsetWidth,
            lis = main.getElementsByTagName("li"),
            links = main.getElementsByTagName("a"),
            count = lis.length;
        measureAndFix();

        function measureAndFix(bypassfont) {
            var widths = [],
                totalWidth = 0;
            for (var i = -1, node, width; node = lis[++i];) {
                width = node.offsetWidth - defaultPadding;
                widths[widths.length] = width;
                totalWidth += width
            }
            var padding = (maxWidth - totalWidth) / count,
                usablePadding = Math.floor(padding),
                extra = Math.floor(((padding * count) - (usablePadding * count)) / 2);
            if (!bypassfont) {
                newFontSize = usablePadding > fontSizeFactor ? (baseFontSize + (usablePadding - fontSizeFactor) / fontSizeFactor) * 10 : false;
                if (newFontSize) {
                    if (newFontSize >= 13) {
                        if (newFontSize > 20) {
                            newFontSize = 20
                        }
                        switch (Math.floor(newFontSize)) {
                        case 13:
                            topPaddingFix = 11;
                            break;
                        case 14:
                            topPaddingFix = 10;
                            break;
                        case 15:
                            topPaddingFix = 9;
                            break;
                        case 16:
                            topPaddingFix = 9;
                            break;
                        case 17:
                            topPaddingFix = 8;
                            break;
                        default:
                            topPaddingFix = 7
                        }
                        $("#gn_main li a,#gn_main li span.nolink").css("padding-top", topPaddingFix)
                    }
                    for (var i = -1, link; link = links[++i];) {
                        link.style.fontSize = newFontSize + "px"
                    }
                    measureAndFix(true)
                } else {
                    resize(widths, extra, usablePadding)
                }
            } else {
                resize(widths, extra, usablePadding)
            }
        }
        function resize(widths, extra, usablePadding) {
            widths[0] += extra;
            widths[count - 1] += extra;
            var newTotal = 0;
            for (var i = -1, link, style; link = links[++i];) {
                D.addClass(link, "fixed");
                style = link.style;
                if (widths[i]) {
                    newTotal += widths[i] + usablePadding;
                    style.width = widths[i] + usablePadding + "px"
                }
            }
            if (newTotal < maxWidth) {
                links[links.length - 1].style.width = widths[widths.length - 1] + usablePadding + Math.floor(maxWidth - newTotal)
            }
        }
    }
}());

var ajaxRevealObj = null;
(function ($) {
    $(document).ready(function () {
        var gnCart = $("#gn li.gn_cart");
        if (gnCart.length > 0) {
            ajaxRevealObj = gnCart.ajaxReveal({
                revealOffsetX: 18,
                revealOffsetY: 0,
                loadingMessage: '<div class="top"></div><div class="center"><div id="cartRevealContent"><div class="cartRevealLoadingMsg"><div class="loadingImg"></div><div class="loadingTxt">loading...</div></div></div></div><div class="bottomWhite"></div>',
                failedMessage: '<div id="cartAjaxResult"><div class="top"></div><div class="center"><div id="cartRevealContent"><div class="cartRevealLoadingMsg"><div class="loadingTxt">Sorry, we\'re unable to preview your cart contents at this time. <div class="revealButtons"><a class="revealButton" href="/cart" title="View/Edit Cart" id="viewButton"><span class="offscreen">View/Edit Cart</span></a></div></div></div></div></div></div><div class="bottomWhite"></div>'
            });
            if (window.location.protocol == "http:") {
                set_message_protocol()
            }
        }
    })
})(jQuery);


function subMenuAnalytics() {

		
	/* GOOGLE ANALYTICS FOR SUBMENU */
	//SubMenu Level1 Items
	jQuery("#gn_fly div .gn_flytab a").click(function()
	{
			_gaq.push(["_trackPageview", "subMenu/global/click" ]);
			_gaq.push(["_trackPageview", "subMenu/" + this.title + "/click" ]);
			//alert("subMenu/" + this.title + "/click");
	});

	//SubMenu Level1 DD Menu Items
	jQuery(".gn_col ul li a").click(function()
	{
			var cls = jQuery(this).attr("class");
			var cls = cls.replace("cs_item","a");
			parentTitle = jQuery("#" + cls).attr("title");
			//alert("subMenu/" + parentTitle + "/" + this.title + "/click");

			_gaq.push(["_trackPageview", "subMenu/global/click" ]);
			_gaq.push(["_trackPageview", "subMenu/" + parentTitle + "/" + this.title + "/click" ]);
	});

	//SubMenu Level2 Items
	jQuery("#gnl_fly div .gn_flytab a").click(function()
	{
			var cls = jQuery(this).attr("class");
			var cls = cls.replace("cs_item","a");
			parentTitle = jQuery("#" + cls).attr("title");
			//alert("subMenu/" + parentTitle + "/" + this.title + "/click");

			_gaq.push(["_trackPageview", "subMenu/global/click" ]);
			_gaq.push(["_trackPageview", "subMenu/" + parentTitle + "/" + this.title + "/click" ]);
	});

	//SubMenu Level2 DD Menu Items
	//nothing yet
	
	/* --- */
/*	jQuery("#gnl_fly div .gn_flybody .gn_col ul li a").click(function()
	{
		var thisItem = jQuery(this).attr("title");
		var theParent = jQuery(this).parent().parent().parent().parent().parent();
		alert(thisItem + " " + parentTitle);
		var parentTitle = jQuery(theParent + " .gn_flytab a").attr(title);
		alert(thisItem + " " + parentTitle);
	});
*/

}

function clickedSubMenu(theId)
{ 
	//Set all top level and sub-submenu level items to standard colors
	jQuery("#top-2 li").css({'backgroundColor' : 'transparent'});
	jQuery("#top-2 li a").css({'color': '#000000'});
	jQuery("#top-2 li a").css({'height': '12px'});
	jQuery("#top-2 li a").css({'padding-bottom': '9px'});
		
	//Set selected level items to highlight colors
	elId = theId.replace("_cs","");
	jQuery("#" + elId + "_a").css({'backgroundColor': '#efefef'});
	jQuery("#" + elId + "_a").css({'height': '17px'});
	jQuery("#" + elId + "_a").css({'padding-bottom': '10px'});
	jQuery("#" + elId + "_a").css({'color': '#0153B7'});

	jQuery("#top-3").css({display: 'block'});

	//Ensure FF does not kick off the sidebar header
	jQuery("#subMenu-container").animate({height : '63px'}, 5000);
	
	elId = elId + "_hi";
	
	//Prevent hover for selected item
	allLevel1Li = jQuery(".gn_level1")
	allLevel1Li.each(function(i) 
	{
		liId = jQuery(allLevel1Li[i]).attr("id");
		if (liId == elId)
		{
			if (liId.indexOf("_selected") == -1)
			{
				jQuery(allLevel1Li[i]).attr("id", liId+"_selected");		
			}
		}
		else
		{
			jQuery(allLevel1Li[i]).attr("id", liId.replace("_selected",""));		
		}
	});

	//jQuery("#browse-navtab").css({height: '20px'});
	
	(function () {
	var Y = GVAR,
	    D = Y.util.Dom,
	    E = Y.util.Event,
	    UA = Y.env.ua,
	    Flyouts = target.NAV.Flyouts,
	    ComboBox = target.NAV.ComboBox;
	target.NAV.ARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8);
	var FOCUS = UA.ie ? "focusin" : "focus",
	    BLUR = UA.ie ? "focusout" : "blur";
	E.onAvailable("gnl_main_fix", updateNav);
	E.onDOMReady(initFlyouts);
	var main, mainItems, sub, subItems, lists, listsItems, combobox, searchInput;
	var newFontSize = false,
	    topPaddingFix, baseFontSize = 1.2,
	    fontSizeFactor = 50,
	    defaultPadding = 10;
	var flyouts = {};
	
	function initFlyouts() {
	    if (findElements()) {
	        redrawSupercats();
	        resizeDetector();
	        addBehavior()
	    } else {
	        setTimeout(initFlyouts, 1500)
	    }
	}
	target.NAV.initFlyouts = initFlyouts;
	
	function findElements() {
	    main = document.getElementById("gnl_main");
	    if (!main) {
	        return false
	    }
	    mainItems = main.getElementsByTagName("a");
	    sub = document.getElementById("gnl_sub");
	    if (sub) {
	        subItems = sub.getElementsByTagName("li")
	    }
	    lists = document.getElementById("gnl_lists");
	    if (lists) {
	        listsItems = lists.getElementsByTagName("li")
	    }
	    return true
	}
	
	function addBehavior() {
	    Flyouts.ieSupport();
	    E.on(mainItems, "mouseover", onMouseOver, "Main");
	    E.on(mainItems, "mouseout", killDelay);
	    if (subItems && subItems.length > 0) {
	        E.on(subItems, "mouseover", onMouseOver, "Sub");
	        E.on(subItems, "mouseout", killDelay)
	    }
	    if (listsItems && listsItems.length > 0) {
	        E.on(listsItems, "mouseover", onMouseOver, "Special");
	        E.on(listsItems, "mouseout", killDelay)
	    }
	    E.on(document.body, "click", clickBody)
	}
	var delay;
	
	function onMouseOver(e, type) {
	    clearTimeout(delay);
	    var trigger = this;
	    openFunc = function () {
	        if (trigger.nodeName.toLowerCase() === "a") {
	            trigger = trigger.parentNode
	        }
	        showFlyout(trigger, type)
	    };
	    delay = setTimeout(openFunc, 50)
	    
	    jQuery(".gn_level1_fly").css({'left' : '-9999px', 'top' : '-9999px'})
	}
	
	function killDelay() {
	    clearTimeout(delay)
	}
	
	function showFlyout(item, type, focusAfterShow) {

		flyOutImager(item.id)
		
		hideFlyouts();
	    if (D.hasClass(item, "gn_active")) {
	        return
	    }
	    if (!flyouts[item.id]) {
	        flyouts[item.id] = Flyouts.create(item, type, newFontSize, topPaddingFix)
	    }
	    if (flyouts[item.id]) {
	        flyouts[item.id].show();
	        if (focusAfterShow) {
	            flyouts[item.id].focus()
	        }
	    }
	}
	
	function hideFlyouts() {
	    for (var id in flyouts) {
	        if (flyouts.hasOwnProperty(id) && flyouts[id]) {
				flyouts[id].hide()
	        }
	    }
	    jQuery(".gn_level1_fly").css({'left' : '-9999px', 'top' : '-9999px'})
	}
	
	function clickBody(e) {
	    var trigger = E.getTarget(e);
	    while (trigger.parentNode) {
	        if (trigger.id == "gnl_fly" || trigger.id == "l2dd_giftfinder" || trigger.id == "l2dd_registry") {
	            return
	        }
	        trigger = trigger.parentNode
	    }
	    hideFlyouts()
	}
	var baseSize = 10,
	    currentSize;
	
	function resizeDetector(callback) {
	    if (target.textResizeDetector) {
	        target.textResizeDetector.init("gnl", function (event, size) {
	            currentSize = size;
	            target.textResizeDetector.event.subscribe(onTextResize);
	            reformatMainNav()
	        })
	    }
	}
	
	function onTextResize() {
	    var newSize = target.textResizeDetector.getSize();
	    if (currentSize !== newSize) {
	        for (var id in flyouts) {
	            if (flyouts.hasOwnProperty(id)) {
	                flyouts[id].reset();
	                flyouts[id] = null
	            }
	        }
	        flyouts = {}
	    }
	    currentSize = newSize;
	    reformatMainNav()
	}
	
	function reformatMainNav() {
	    if (currentSize > baseSize) {
	        D.addClass(main, "tooBig")
	    } else {
	        D.removeClass(main, "tooBig")
	    }
	}
	
	function updateNav() {
	    redrawSupercats();
	    navWidths()
	}
	
	function redrawSupercats() {
	    if (!target.ui.gn.redrawSupercats) {
	        return
	    }
	    if (typeof(redrawSupercats.called) == "undefined") {
	        redrawSupercats.called = true
	    } else {
	        return
	    }
	    if (target.ui.gn.data.supercats) {
	        var supercats = target.ui.gn.data.supercats.data;
	        var supercatsDiv = document.getElementById("gnl_main");
	        var incat = target.ui.gn.incat;
	        var newList = document.createElement("ul");
	        for (var i = 0; i < supercats.children.length; i++) {
	            var linkNum = i + 1;
	            var child = supercats.children[i];
	            var newItem = document.createElement("li");
	            newItem.setAttribute("id", "gnl_main_" + linkNum);
	            var className = "";
	            if (i == 0) {
	                className += " first-child"
	            }
	            if (i == supercats.children.length - 1) {
	                className += " last-child"
	            }
	            if (incat == "icn_" + child.location) {
	                var emptySpan = document.createElement("span");
	                newItem.appendChild(emptySpan);
	                className += " gn_active"
	            }
	            if (className) {
	                newItem.setAttribute("class", className);
	                newItem.setAttribute("className", className)
	            }
	            var newLink = document.createElement("a");
	            newLink.setAttribute("href", target.ui.gn.nonsecureserver + "/b/ref=nav_t_spc_" + linkNum + "_0?ie=UTF8&node=" + child.location);
	            if (child.title) {
	                newLink.setAttribute("title", child.title)
	            }
	            newLink.innerHTML = child.text;
	            newItem.appendChild(newLink);
	            newList.appendChild(newItem)
	        }
	        var list = supercatsDiv.getElementsByTagName("ul")[0];
	        supercatsDiv.insertBefore(newList, list);
	        supercatsDiv.removeChild(list)
	    }
	}
	
	function navWidths() {
	    var main = document.getElementById("gnl_main"),
	        maxWidth = main.offsetWidth - 10,
	        lis = main.getElementsByTagName("li"),
	        links = main.getElementsByTagName("a"),
	        count = lis.length;
	    measureAndFix();
	    
	    function measureAndFix(bypassfont) {
	        var widths = [],
	            totalWidth = 0;
	        for (var i = -1, node, width; node = lis[++i];) {
	            width = node.offsetWidth - defaultPadding;
	            widths[widths.length] = width;
	            totalWidth += width
	        }
	        var padding = (maxWidth - totalWidth) / count,
	            usablePadding = Math.floor(padding),
	            extra = Math.floor(((padding * count) - (usablePadding * count)) / 2);
	        if (!bypassfont) {
	            newFontSize = usablePadding > fontSizeFactor ? (baseFontSize + (usablePadding - fontSizeFactor) / fontSizeFactor) * 10 : false;
	            if (newFontSize) {
	                if (newFontSize >= 13) {
	                    newFontSize = 13 //fixed it for AllegroMedical
                        topPaddingFix = 11;
	                    jQuery("#gnl_main li a,#gnl_main li span.nolink").css("padding-top", topPaddingFix)
	                }
	                for (var i = -1, link; link = links[++i];) {
	                    link.style.fontSize = newFontSize + "px"
	                }
	                measureAndFix(true)
	            } else {
	                resize(widths, extra, usablePadding)
	            }
	        } else {
	            resize(widths, extra, usablePadding)
	        }
	    }
	
	    function resize(widths, extra, usablePadding) 
	    {
	        widths[0] += extra;
	        widths[count - 1] += extra;
	        var newTotal = 0;
	        for (var i = -1, link, style; link = links[++i];) 
	        {
	            D.addClass(link, "fixed");
	            style = link.style;
	            if (widths[i]) 
	            {
	                newTotal += widths[i] + usablePadding;
	                style.width = widths[i] + usablePadding + "px"
	            }
	        }
	        if (newTotal < maxWidth) {
	            links[links.length - 1].style.width = widths[widths.length - 1] + usablePadding + Math.floor(maxWidth - newTotal)
	        }
	    }
	}
	}());	
}

function mainMenuActivate()
{ 
	(function () {
	var Y = GVAR,
	    D = Y.util.Dom,
	    E = Y.util.Event,
	    UA = Y.env.ua,
	    Flyouts = target.NAV.Flyouts,
	    ComboBox = target.NAV.ComboBox;
	target.NAV.ARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8);
	var FOCUS = UA.ie ? "focusin" : "focus",
	    BLUR = UA.ie ? "focusout" : "blur";
	E.onAvailable("mn_mainheader_fix", updateNav);
	E.onDOMReady(initFlyouts);
	var main, mainItems, sub, subItems, lists, listsItems, combobox, searchInput;
	var newFontSize = false,
	    topPaddingFix, baseFontSize = 1.2,
	    fontSizeFactor = 50,
	    defaultPadding = 10;
	var flyouts = {};
	
	function initFlyouts() {
	    if (findElements()) {
	        redrawSupercats();
	        resizeDetector();
	        addBehavior()
	    } else {
	        setTimeout(initFlyouts, 1500)
	    }
	}
	target.NAV.initFlyouts = initFlyouts;
	
	function findElements() {
	    main = document.getElementById("mn_mainheader");
	    if (!main) {
	        return false
	    }
	    mainItems = main.getElementsByTagName("a");
	    sub = document.getElementById("mn_subheader");
	    if (sub) {
	        subItems = sub.getElementsByTagName("li")
	    }
	    lists = document.getElementById("mn_listsheader");
	    if (lists) {
	        listsItems = lists.getElementsByTagName("li")
	    }
	    return true
	}
	
	function addBehavior() {
	    Flyouts.ieSupport();
	    E.on(mainItems, "mouseover", onMouseOver, "Main");
	    E.on(mainItems, "mouseout", killDelay);
	    if (subItems && subItems.length > 0) {
	        E.on(subItems, "mouseover", onMouseOver, "Sub");
	        E.on(subItems, "mouseout", killDelay)
	    }
	    if (listsItems && listsItems.length > 0) {
	        E.on(listsItems, "mouseover", onMouseOver, "Special");
	        E.on(listsItems, "mouseout", killDelay)
	    }
	    E.on(document.body, "click", clickBody)
	}
	var delay;
	
	function onMouseOver(e, type) {
	    clearTimeout(delay);
	    var trigger = this;
	    openFunc = function () {
	        if (trigger.nodeName.toLowerCase() === "a") {
	            trigger = trigger.parentNode
	        }
	        showFlyout(trigger, type)
	    };
	    delay = setTimeout(openFunc, 50)
	    
	    jQuery(".gn_level1_fly").css({'left' : '-9999px', 'top' : '-9999px'})
	}
	
	function killDelay() {
	    clearTimeout(delay)
	}
	
	function showFlyout(item, type, focusAfterShow) {

		flyOutImager(item.id)
		
		hideFlyouts();
	    if (D.hasClass(item, "gn_active")) {
	        return
	    }
	    if (!flyouts[item.id]) {
	        flyouts[item.id] = Flyouts.create(item, type, newFontSize, topPaddingFix)
	    }
	    if (flyouts[item.id]) {
	        flyouts[item.id].show();
	        if (focusAfterShow) {
	            flyouts[item.id].focus()
	        }
	    }
	}
	
	function hideFlyouts() {
	    for (var id in flyouts) {
	        if (flyouts.hasOwnProperty(id) && flyouts[id]) {
				flyouts[id].hide()
	        }
	    }
	    jQuery(".gn_level1_fly").css({'left' : '-9999px', 'top' : '-9999px'})
	}
	
	function clickBody(e) {
	    var trigger = E.getTarget(e);
	    while (trigger.parentNode) {
	        if (trigger.id == "mn_flyheader" || trigger.id == "l2dd_giftfinder" || trigger.id == "l2dd_registry") {
	            return
	        }
	        trigger = trigger.parentNode
	    }
	    hideFlyouts()
	}
	var baseSize = 10,
	    currentSize;
	
	function resizeDetector(callback) {
	    if (target.textResizeDetector) {
	        target.textResizeDetector.init("mn", function (event, size) {
	            currentSize = size;
	            target.textResizeDetector.event.subscribe(onTextResize);
	            reformatMainNav()
	        })
	    }
	}
	
	function onTextResize() {
	    var newSize = target.textResizeDetector.getSize();
	    if (currentSize !== newSize) {
	        for (var id in flyouts) {
	            if (flyouts.hasOwnProperty(id)) {
	                flyouts[id].reset();
	                flyouts[id] = null
	            }
	        }
	        flyouts = {}
	    }
	    currentSize = newSize;
	    reformatMainNav()
	}
	
	function reformatMainNav() {
	    if (currentSize > baseSize) {
	        D.addClass(main, "tooBig")
	    } else {
	        D.removeClass(main, "tooBig")
	    }
	}
	
	function updateNav() {
	    redrawSupercats();
	    navWidths()
	}
	
	function redrawSupercats() {
	    if (!target.ui.gn.redrawSupercats) {
	        return
	    }
	    if (typeof(redrawSupercats.called) == "undefined") {
	        redrawSupercats.called = true
	    } else {
	        return
	    }
	    if (target.ui.gn.data.supercats) {
	        var supercats = target.ui.gn.data.supercats.data;
	        var supercatsDiv = document.getElementById("mn_mainheader");
	        var incat = target.ui.gn.incat;
	        var newList = document.createElement("ul");
	        for (var i = 0; i < supercats.children.length; i++) {
	            var linkNum = i + 1;
	            var child = supercats.children[i];
	            var newItem = document.createElement("li");
	            newItem.setAttribute("id", "mn_main_header" + linkNum);
	            var className = "";
	            if (i == 0) {
	                className += " first-child"
	            }
	            if (i == supercats.children.length - 1) {
	                className += " last-child"
	            }
	            if (incat == "icn_" + child.location) {
	                var emptySpan = document.createElement("span");
	                newItem.appendChild(emptySpan);
	                className += " gn_active"
	            }
	            if (className) {
	                newItem.setAttribute("class", className);
	                newItem.setAttribute("className", className)
	            }
	            var newLink = document.createElement("a");
	            newLink.setAttribute("href", target.ui.gn.nonsecureserver + "/b/ref=nav_t_spc_" + linkNum + "_0?ie=UTF8&node=" + child.location);
	            if (child.title) {
	                newLink.setAttribute("title", child.title)
	            }
	            newLink.innerHTML = child.text;
	            newItem.appendChild(newLink);
	            newList.appendChild(newItem)
	        }
	        var list = supercatsDiv.getElementsByTagName("ul")[0];
	        supercatsDiv.insertBefore(newList, list);
	        supercatsDiv.removeChild(list)
	    }
	}
	
	function navWidths() {
	    var main = document.getElementById("mn_mainheader"),
	        maxWidth = main.offsetWidth - 10,
	        lis = main.getElementsByTagName("li"),
	        links = main.getElementsByTagName("a"),
	        count = lis.length;
	    measureAndFix();
	    
	    function measureAndFix(bypassfont) {
	        var widths = [],
	            totalWidth = 0;
	        for (var i = -1, node, width; node = lis[++i];) {
	            width = node.offsetWidth - defaultPadding;
	            widths[widths.length] = width;
	            totalWidth += width
	        }
	        var padding = (maxWidth - totalWidth) / count,
	            usablePadding = Math.floor(padding),
	            extra = Math.floor(((padding * count) - (usablePadding * count)) / 2);
	        if (!bypassfont) {
	            newFontSize = usablePadding > fontSizeFactor ? (baseFontSize + (usablePadding - fontSizeFactor) / fontSizeFactor) * 10 : false;
	            if (newFontSize) {
	                if (newFontSize >= 13) {
	                    newFontSize = 13 //fixed it for AllegroMedical
                        topPaddingFix = 11;
	                    jQuery("#mn_mainheader li a,#mn_mainheader li span.nolink").css("padding-top", topPaddingFix)
	                }
	                for (var i = -1, link; link = links[++i];) {
	                    link.style.fontSize = newFontSize + "px"
	                }
	                measureAndFix(true)
	            } else {
	                resize(widths, extra, usablePadding)
	            }
	        } else {
	            resize(widths, extra, usablePadding)
	        }
	    }
	
	    function resize(widths, extra, usablePadding) 
	    {
	        widths[0] += extra;
	        widths[count - 1] += extra;
	        var newTotal = 0;
	        for (var i = -1, link, style; link = links[++i];) 
	        {
	            D.addClass(link, "fixed");
	            style = link.style;
	            if (widths[i]) 
	            {
	                newTotal += widths[i] + usablePadding;
	                style.width = widths[i] + usablePadding + "px"
	            }
	        }
	        if (newTotal < maxWidth) {
	            links[links.length - 1].style.width = widths[widths.length - 1] + usablePadding + Math.floor(maxWidth - newTotal)
	        }
	    }
	}
	}());	
}

function headerMenuActivate()
{ 
	(function () {
	var Y = GVAR,
	    D = Y.util.Dom,
	    E = Y.util.Event,
	    UA = Y.env.ua,
	    Flyouts = target.NAV.Flyouts,
	    ComboBox = target.NAV.ComboBox;
	target.NAV.ARIA = (UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8);
	var FOCUS = UA.ie ? "focusin" : "focus",
	    BLUR = UA.ie ? "focusout" : "blur";
	E.onAvailable("gnl_main_headerfix", updateNav);
	E.onDOMReady(initFlyouts);
	var main, mainItems, sub, subItems, lists, listsItems, combobox, searchInput;
	var newFontSize = false,
	    topPaddingFix, baseFontSize = 1.2,
	    fontSizeFactor = 50,
	    defaultPadding = 10;
	var flyouts = {};
	
	function initFlyouts() {
	    if (findElements()) {
	        redrawSupercats();
	        resizeDetector();
	        addBehavior()
	    } else {
	        setTimeout(initFlyouts, 1500)
	    }
	}
	target.NAV.initFlyouts = initFlyouts;
	
	function findElements() {
	    main = document.getElementById("gn_mainheader");
	    if (!main) {
	        return false
	    }
	    mainItems = main.getElementsByTagName("a");
	    sub = document.getElementById("gn_subheader");
	    if (sub) {
	        subItems = sub.getElementsByTagName("li")
	    }
	    lists = document.getElementById("gn_lists");
	    if (lists) {
	        listsItems = lists.getElementsByTagName("li")
	    }
	    return true
	}
	
	function addBehavior() {
	    Flyouts.ieSupport();
	    E.on(mainItems, "mouseover", onMouseOver, "Main");
	    E.on(mainItems, "mouseout", killDelay);
	    if (subItems && subItems.length > 0) {
	        E.on(subItems, "mouseover", onMouseOver, "Sub");
	        E.on(subItems, "mouseout", killDelay)
	    }
	    if (listsItems && listsItems.length > 0) {
	        E.on(listsItems, "mouseover", onMouseOver, "Special");
	        E.on(listsItems, "mouseout", killDelay)
	    }
	    E.on(document.body, "click", clickBody)
	}
	var delay;
	
	function onMouseOver(e, type) 
	{
	    clearTimeout(delay);
	    var trigger = this;
	    openFunc = function () {
	        if (trigger.nodeName.toLowerCase() === "a") 
	        {
	            trigger = trigger.parentNode
	        }
	        showFlyout(trigger, type)
	    };
	    delay = setTimeout(openFunc, 50)
	}
	
	function killDelay() {
	    clearTimeout(delay)
	}
	
	function showFlyout(item, type, focusAfterShow) {

		hideFlyouts();
	    if (D.hasClass(item, "gn_active")) {
	        return
	    }
	    if (!flyouts[item.id]) {
	        flyouts[item.id] = Flyouts.create(item, type, newFontSize, topPaddingFix)
	    }
	    if (flyouts[item.id]) {
	    	flyouts[item.id].show();
	        if (focusAfterShow) {
	            flyouts[item.id].focus()
	        }
	    }
	}
	
	function hideFlyouts() 
	{
	    for (var id in flyouts) 
	    {
	        if (flyouts.hasOwnProperty(id) && flyouts[id]) 
	        {
				flyouts[id].hide()
	        }
	    }
	}
	
	function clickBody(e) {
	    var trigger = E.getTarget(e);
	    while (trigger.parentNode) {
	        if (trigger.id == "gn_flyheader" || trigger.id == "l2dd_giftfinder" || trigger.id == "l2dd_registry") {
	            return
	        }
	        trigger = trigger.parentNode
	    }
	    hideFlyouts()
	}
	var baseSize = 10,
	    currentSize;
	
	function resizeDetector(callback) {
	    if (target.textResizeDetector) {
	        target.textResizeDetector.init("gnheader", function (event, size) {
	            currentSize = size;
	            target.textResizeDetector.event.subscribe(onTextResize);
	            reformatMainNav()
	        })
	    }
	}
	
	function onTextResize() {
	    var newSize = target.textResizeDetector.getSize();
	    if (currentSize !== newSize) {
	        for (var id in flyouts) {
	            if (flyouts.hasOwnProperty(id)) {
	                flyouts[id].reset();
	                flyouts[id] = null
	            }
	        }
	        flyouts = {}
	    }
	    currentSize = newSize;
	    reformatMainNav()
	}
	
	function reformatMainNav() {
	    if (currentSize > baseSize) {
	        D.addClass(main, "tooBig")
	    } else {
	        D.removeClass(main, "tooBig")
	    }
	}
	
	function updateNav() {
	    redrawSupercats();
	    navWidths()
	}
	
	function redrawSupercats() {
	    if (!target.ui.gn.redrawSupercats) {
	        return
	    }
	    if (typeof(redrawSupercats.called) == "undefined") {
	        redrawSupercats.called = true
	    } else {
	        return
	    }
	    if (target.ui.gn.data.supercats) {
	        var supercats = target.ui.gn.data.supercats.data;
	        var supercatsDiv = document.getElementById("gn_mainheader");
	        var incat = target.ui.gn.incat;
	        var newList = document.createElement("ul");
	        for (var i = 0; i < supercats.children.length; i++) {
	            var linkNum = i + 1;
	            var child = supercats.children[i];
	            var newItem = document.createElement("li");
	            newItem.setAttribute("id", "gn_main_header" + linkNum);
	            var className = "";
	            if (i == 0) {
	                className += " first-child"
	            }
	            if (i == supercats.children.length - 1) {
	                className += " last-child"
	            }
	            if (incat == "icn_" + child.location) {
	                var emptySpan = document.createElement("span");
	                newItem.appendChild(emptySpan);
	                className += " gn_active"
	            }
	            if (className) {
	                newItem.setAttribute("class", className);
	                newItem.setAttribute("className", className)
	            }
	            var newLink = document.createElement("a");
	            newLink.setAttribute("href", target.ui.gn.nonsecureserver + "/b/ref=nav_t_spc_" + linkNum + "_0?ie=UTF8&node=" + child.location);
	            if (child.title) {
	                newLink.setAttribute("title", child.title)
	            }
	            newLink.innerHTML = child.text;
	            newItem.appendChild(newLink);
	            newList.appendChild(newItem)
	        }
	        var list = supercatsDiv.getElementsByTagName("ul")[0];
	        supercatsDiv.insertBefore(newList, list);
	        supercatsDiv.removeChild(list)
	    }
	}
	
	function navWidths() {
	    var main = document.getElementById("gn_mainheader"),
	        maxWidth = main.offsetWidth - 10,
	        lis = main.getElementsByTagName("li"),
	        links = main.getElementsByTagName("a"),
	        count = lis.length;
	    measureAndFix();
	    
	    function measureAndFix(bypassfont) {
	        var widths = [],
	            totalWidth = 0;
	        for (var i = -1, node, width; node = lis[++i];) {
	            width = node.offsetWidth - defaultPadding;
	            widths[widths.length] = width;
	            totalWidth += width
	        }
	        var padding = (maxWidth - totalWidth) / count,
	            usablePadding = Math.floor(padding),
	            extra = Math.floor(((padding * count) - (usablePadding * count)) / 2);
	        if (!bypassfont) {
	            newFontSize = usablePadding > fontSizeFactor ? (baseFontSize + (usablePadding - fontSizeFactor) / fontSizeFactor) * 10 : false;
	            if (newFontSize) {
	                if (newFontSize >= 13) {
	                    newFontSize = 13 //fixed it for AllegroMedical
                        topPaddingFix = 11;
	                    jQuery("#gn_mainheader li a,#gn_mainheader li span.nolink").css("padding-top", topPaddingFix)
	                }
	                for (var i = -1, link; link = links[++i];) {
	                    link.style.fontSize = newFontSize + "px"
	                }
	                measureAndFix(true)
	            } else {
	                resize(widths, extra, usablePadding)
	            }
	        } else {
	            resize(widths, extra, usablePadding)
	        }
	    }
	
	    function resize(widths, extra, usablePadding) 
	    {
	        widths[0] += extra;
	        widths[count - 1] += extra;
	        var newTotal = 0;
	        for (var i = -1, link, style; link = links[++i];) 
	        {
	            D.addClass(link, "fixed");
	            style = link.style;
	            if (widths[i]) 
	            {
	                newTotal += widths[i] + usablePadding;
	                style.width = widths[i] + usablePadding + "px"
	            }
	        }
	        if (newTotal < maxWidth) {
	            links[links.length - 1].style.width = widths[widths.length - 1] + usablePadding + Math.floor(maxWidth - newTotal)
	        }
	    }
	}
	}());	
}

function flyOutImager(theId)
{
	at1 = theId.replace("gnl_main_","");		
	at1 = "gnl_mainfly_" + at1;
	allLevel2 = jQuery("#" + at1 + " .gn_flybody .gn_col div div .sidebar-prod")
	allLevel2.each(function(k) 
	{
		at1 = jQuery(allLevel2[k]).attr("id").replace("rpMiniProd","");
		var tmparr = new Array();
		tmparr = at1.split("_")
		var t = subMenuProductsArray.length
		if (jQuery.inArray(tmparr[0] + tmparr[1], subMenuProductsArray) == -1)
		{
			subMenuProductsArray[t] = tmparr[0] + tmparr[1];
			t = t + 1;

			//Place image
			imgUrl = jQuery("#rpMiniProd" + tmparr[0] + "_" + tmparr[1] + " .sidebarProductBlock a").attr("name");
			jQuery("#rpMiniProd" + tmparr[0] + "_" + tmparr[1] + " .sidebarProductBlock a").append('<img src="' + imgUrl + '" alt="" width="45" height="45" style="display:inline;text-align:middle">')

			//activate product popup
			miniProductPageAjax(tmparr[0],"rpMiniProd" + tmparr[0] + "_" + tmparr[1], 'subMenuProducts', '#000099');				
		}
	});
}
