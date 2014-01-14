const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

let text, button;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    let tunedadm = GLib.find_program_in_path('tuned-adm');
    global.log("tunedadm= " + tunedadm);
    let pkexec = GLib.find_program_in_path('pkexec');
    global.log("pkexec= " + pkexec);
    global.log("exec-line=" + pkexec + " " + tunedadm  + " list");
    //let profile_list = GLib.spawn_command_line_sync(pkexec + " " + tunedadm  + " list").toString().trim();
    let profile_list = GLib.spawn_command_line_sync(tunedadm  + " list").toString().trim();
    global.log("profile_list= " + profile_list);
       

      if (!text) {
	let tunedadm = GLib.find_program_in_path('tuned-adm');
	global.log("tunedadm= " + tunedadm);
	let profile_list = GLib.spawn_command_line_sync(tunedadm  + " list")[1].toString().trim();
	global.log("profile_list= " + profile_list);
       
        //text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!" });
        text = new St.Label({ style_class: 'helloworld-label', text: profile_list });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 2,
                       transition: 'easeOutQuad',
                       onComplete: _hideHello });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _showHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
