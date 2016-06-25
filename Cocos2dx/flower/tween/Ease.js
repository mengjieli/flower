class Ease {

    static NONE = "None";
    static SINE_EASE_IN = "SineEaseIn";
    static SineEaseOut = "SineEaseOut";
    static SINE_EASE_IN_OUT = "SineEaseInOut";
    static SineEaseOutIn = "SineEaseOutIn";
    static QUAD_EASE_IN = "QuadEaseIn";
    static QUAD_EASE_OUT = "QuadEaseOut";
    static QUAD_EASE_IN_OUT = "QuadEaseInOut";
    static QUAD_EASE_OUT_IN = "QuadEaseOutIn";
    static CUBIC_EASE_IN = "CubicEaseIn";
    static CUBIC_EASE_OUT = "CubicEaseOut";
    static CUBIC_EASE_IN_OUT = "CubicEaseInOut";
    static CUBIC_EASE_OUT_IN = "CubicEaseOutIn";
    static QUART_EASE_IN = "QuartEaseIn";
    static QUART_EASE_OUT = "QuartEaseOut";
    static QUART_EASE_IN_OUT = "QuartEaseInOut";
    static QUART_EASE_OUT_IN = "QuartEaseOutIn";
    static QUINT_EASE_IN = "QuintEaseIn";
    static QUINT_EASE_OUT = "QuintEaseOut";
    static QUINT_EASE_IN_OUT = "QuintEaseInOut";
    static QUINT_EASE_OUT_IN = "QuintEaseOutIn";
    static EXPO_EASE_IN = "ExpoEaseIn";
    static EXPO_EASE_OUT = "ExpoEaseOut";
    static EXPO_EASE_IN_OUT = "ExpoEaseInOut";
    static EXPO_EASE_OUT_IN = "ExpoEaseOutIn";
    static CIRC_EASE_IN = "CircEaseIn";
    static CIRC_EASE_OUT = "CircEaseOut";
    static CIRC_EASE_IN_OUT = "CircEaseInOut";
    static CIRC_EASE_OUT_IN = "CircEaseOutIn";
    static BACK_EASE_IN = "BackEaseIn";
    static BACK_EASE_OUT = "BackEaseOut";
    static BACK_EASE_IN_OUT = "BackEaseInOut";
    static BACK_EASE_OUT_IN = "BackEaseOutIn";
    static ELASTIC_EASE_IN = "ElasticEaseIn";
    static ELASTIC_EASE_OUT = "ElasticEaseOut";
    static ELASTIC_EASE_IN_OUT = "ElasticEaseInOut";
    static ELASTIC_EASE_OUT_IN = "ElasticEaseOutIn";
    static BOUNCE_EASE_IN = "BounceEaseIn";
    static BounceEaseOut = "BounceEaseOut";
    static BOUNCE_EASE_IN_OUT = "BounceEaseInOut";
    static BOUNCE_EASE_OUT_IN = "BounceEaseOutIn";

    static registerEaseFunction(name, ease) {
        EaseFunction[name] = ease;
    }
}

exports.Ease = Ease;