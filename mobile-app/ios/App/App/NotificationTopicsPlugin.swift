import Capacitor
import FirebaseMessaging

// Mirrors android/app/src/main/java/com/taleemaateislam/app/NotificationTopicsPlugin.java -
// same JS-facing name/methods so components.js needs no platform branching.
@objc(NotificationTopicsPlugin)
public class NotificationTopicsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NotificationTopicsPlugin"
    public let jsName = "NotificationTopics"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "subscribe", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "unsubscribe", returnType: CAPPluginReturnPromise)
    ]

    @objc func subscribe(_ call: CAPPluginCall) {
        guard let topic = call.getString("topic"), !topic.isEmpty else {
            call.reject("topic is required")
            return
        }
        Messaging.messaging().subscribe(toTopic: topic) { error in
            if let error = error {
                call.reject("Failed to subscribe to \(topic)", nil, error)
            } else {
                call.resolve()
            }
        }
    }

    @objc func unsubscribe(_ call: CAPPluginCall) {
        guard let topic = call.getString("topic"), !topic.isEmpty else {
            call.reject("topic is required")
            return
        }
        Messaging.messaging().unsubscribe(fromTopic: topic) { error in
            if let error = error {
                call.reject("Failed to unsubscribe from \(topic)", nil, error)
            } else {
                call.resolve()
            }
        }
    }
}
