const { exec } = require("child_process");

function getReportFromROS() {
  return new Promise((resolve, reject) => {

    const command = `
    source ~/ros2_ws/install/setup.bash &&
    ros2 service call /get_robot_report robot_interfaces/srv/GetRobotReport
    `;

    exec(command, { shell: "/bin/bash" }, (error, stdout) => {

      if (error) {
        return reject(error);
      }

      try {

        const match = stdout.match(/report_json='(.*)'/);

        if (!match) {
          return reject(
            new Error("ROS response parse failed")
          );
        }

        const data = JSON.parse(match[1]);

        resolve(data);

      } catch (err) {
        reject(err);
      }

    });

  });
}

const sendRosCommand = (command) => {
    const piHost = "pi@192.168.1.33";
    const rosCmd = `ros2 topic pub --once /robot_command std_msgs/msg/String "{data: '${command}'}"`;
    const sshCmd = `ssh ${piHost} '${rosCmd}'`;

    return new Promise((resolve, reject) => {
        exec(sshCmd, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
            } else {
                resolve(stdout);
            }
        });
    });
};

module.exports = { sendRosCommand, getReportFromROS };