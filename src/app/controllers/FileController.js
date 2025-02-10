import File from "../models/File";

class FileController {
  async create(req, res) {
    try {
      //const { filename } = req.file;
      const { originalname: name, filename: path } = req.file;
      const file = await File.create({ name, path });

      return res.status(200).json({ message: "ok", file });
    } catch (err) {
      console.error("File upload error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", messages: err.message });
    }
  }
}

export default new FileController();
