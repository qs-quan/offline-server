package com.orient.util;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * 文件操作的底层操作类
 *
 * @author 施俊
 * @version 1.0
 * @see
 * @since 2004-11-29
 */
public class FileOperator {

    public FileOperator() {
    }

    /**
     * 读取文件
     *
     * @param fileName 文件名称
     * @return
     */
    public static String readFile(String fileName) {
        try {
            File file = new File(fileName);
            String charset = getCharset(file);
            StringBuffer sb = new StringBuffer();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(fileName), charset));
            String str;
            while ((str = in.readLine()) != null) {
                sb.append(str + "\r\n");
            }
            in.close();
            return sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 读取文件
     *
     * @param file 文件
     * @return
     */
    public static String readFile(File file) {
        try {
            String charset = getCharset(file);
            StringBuffer sb = new StringBuffer();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    new FileInputStream(file), charset));
            String str;
            while ((str = in.readLine()) != null) {
                sb.append(str + "\r\n");
            }
            in.close();
            return sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 获取文件的字符集
     *
     * @param file
     * @return
     */
    public static String getCharset(File file) {
        String charset = "GBK";
        byte[] first3Bytes = new byte[3];
        try {
            boolean checked = false;
            BufferedInputStream bis = new BufferedInputStream(
                    new FileInputStream(file));
            bis.mark(0);
            int read = bis.read(first3Bytes, 0, 3);
            if (read == -1)
                return charset;
            if (first3Bytes[0] == (byte) 0xFF && first3Bytes[1] == (byte) 0xFE) {
                charset = "UTF-16LE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xFE
                    && first3Bytes[1] == (byte) 0xFF) {
                charset = "UTF-16BE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xEF
                    && first3Bytes[1] == (byte) 0xBB
                    && first3Bytes[2] == (byte) 0xBF) {
                charset = "UTF-8";
                checked = true;
            }
            bis.reset();

            if (!checked) {
                int loc = 0;
                while ((read = bis.read()) != -1) {
                    loc++;
                    if (read >= 0xF0)
                        break;
                    // 单独出现BF以下的，也算是GBK
                    if (0x80 <= read && read <= 0xBF)
                        break;
                    if (0xC0 <= read && read <= 0xDF) {
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF)// 双字节 (0xC0 - 0xDF)
                            // (0x80 -
                            // 0xBF),也可能在GB编码内
                            continue;
                        else
                            break;
                        // 也有可能出错，但是几率较小
                    } else if (0xE0 <= read && read <= 0xEF) {
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF) {
                            read = bis.read();
                            if (0x80 <= read && read <= 0xBF) {
                                charset = "UTF-8";
                                break;
                            } else
                                break;
                        } else
                            break;
                    }
                }

            }
            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return charset;
    }

    public static boolean reNameFile(String oldName, String newName) {
        boolean jdg = true;
        try {
            File oldFile = new File(oldName);
            File newFile = new File(newName);
            oldFile.renameTo(newFile);
        } catch (Exception e) {
            e.printStackTrace();
            jdg = false;
        }
        return jdg;
    }

    /**
     * 将原文件拷贝到目标文件
     *
     * @param sourceFile
     * @param targetFile
     * @return boolean
     */
    public static boolean copyFile(String sourceFile, String targetFile) {
        String path = sourceFile;
        String target = targetFile;
        boolean flag = true;
        try {
            File file = new File(path);
            FileInputStream stream = new FileInputStream(file);//把文件读入
            OutputStream bos = new FileOutputStream(target);//建立一个上传文件的输出流
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = stream.read(buffer, 0, 8192)) != -1) {
                bos.write(buffer, 0, bytesRead);//将文件写入服务器
            }
            bos.close();
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
            flag = false;
        }
        return flag;
    }

    /**
     * 文件夹下所有文件夹和文件的拷贝
     *
     * @param source
     * @param target
     */
    public static void copyDirectiory(String source, String target) {
        String file1 = target;
        String file2 = source;
        try {
            (new File(file1)).mkdirs();
            File[] file = (new File(file2)).listFiles();
            for (int i = 0; i < file.length; i++) {
                if (file[i].isFile()) {
                    FileInputStream input = new FileInputStream(file[i]);
                    FileOutputStream output = new FileOutputStream(file1 + "/" + file[i]
                            .getName());
                    byte[] b = new byte[1024 * 5];
                    int len;
                    while ((len = input.read(b)) != -1) {
                        output.write(b, 0, len);
                    }
                    output.flush();
                    output.close();
                    input.close();
                }
                if (file[i].isDirectory()) {
                    copyDirectiory(file2 + "/" + file[i].getName(), file1 + "/" + file[i]
                            .getName());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private List fileWithPath = new ArrayList();

    private void getFileWithPath(String target) {
        String file2 = target;
        try {
            File[] file = (new File(file2)).listFiles();
            for (int i = 0; i < file.length; i++) {
                if (file[i].isFile()) {
                    fileWithPath.add(file2 + File.separator + file[i].getName());
                }
                if (file[i].isDirectory()) {
                    this.getAllFileWithPath(file2 + File.separator + file[i]
                            .getName());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据文件路径取得该文件路径下的所有文件
     *
     * @param target 文件路径
     * @return List 返回的文件路径list
     */
    public List getAllFileWithPath(String target) {
        this.getFileWithPath(target);
        return this.fileWithPath;
    }

    /**
     * 删除文件夹，如果该文件夹下有子文件或者文件夹，则全部删除
     *
     * @param path 要删除的文件夹
     * @return boolean
     */
    public static boolean delFoldsWithChilds(String path) {
        int files = 0;
        File file = new File(path);
        File[] tmp = file.listFiles();
        if (tmp == null) {
            files = 0;
        } else {
            files = tmp.length;
        }
        for (int i = 0; i < files; i++) {
            FileOperator.delFoldsWithChilds(tmp[i].getAbsolutePath());
        }
        boolean ret = FileOperator.deleteFolder(path);
        return ret;
    }

    /**
     * 判断文件或者文件夹是否存在
     *
     * @param folderName 文件或者文件夹的绝对路径
     * @return boolean
     */
    public static boolean isFileExist(String folderName) {
        File file = new File(folderName);
        boolean returnBoolean = file.exists();
        return returnBoolean;
    }

    /**
     * 这里的路径格式必须是：c:\tmp\tmp\ 或者是c:\tmp\tmp
     *
     * @param path
     * @return boolean
     */
    public static boolean createFolders(String path) {
        return (new File(path)).mkdirs();
    }

    /**
     * 取得文件名称（带后缀）
     *
     * @param filePath 文件路径（包括文件名称）
     * @return String 文件名称
     */
    public static String getFileName(String filePath) {
        String fileName = "";
        String tmpFilePath = filePath;
        int winIndex = tmpFilePath.lastIndexOf("\\");
        int linuxIndex = tmpFilePath.lastIndexOf("/");
        if (winIndex != -1)
            fileName = tmpFilePath.substring(winIndex + 1, tmpFilePath
                    .length()).trim();
        if (linuxIndex != -1)
            fileName = tmpFilePath.substring(linuxIndex + 1, tmpFilePath
                    .length()).trim();
        return fileName;
    }

    /**
     * 得到文件的后缀
     *
     * @param fileName 文件名称
     * @return String 后缀名称
     */
    public static String getSuffix(String fileName) {
        String returnSuffix = "";
        String tmp = "";
        try {
            int index = fileName.lastIndexOf(".");
            if (index == -1) {
                tmp = "";
            } else
                tmp = fileName.substring(index + 1, fileName.length());
        } catch (Exception e) {
            tmp = "";
        }
        returnSuffix = tmp;
        return returnSuffix;
    }

    /**
     * 递归创建文件
     *
     * @param path
     * @return boolean
     */
    public static boolean createFolds(String path) {
        boolean ret = false;
        String child = path;
        if (!FileOperator.isFileExist(path)) {
            int i = path.lastIndexOf(File.separator);
            String pathTmp = path.substring(0, i);
            child = pathTmp;
            FileOperator.createFolds(pathTmp);
            ret = FileOperator.createFolder(child);
        } else {
            ret = false;
        }
        return ret;
    }

    /**
     * 将文件的路径格式转换为标准的文件路径格式
     *
     * @param inputPath 原文件路径
     * @return String 转换后的文件路径
     */
    public static String toStanderds(String inputPath) {
        String rtp = "";
        /**
         * 这是使用正则表达式进行替换 先把所有的路径格式替换为linux下的，会出现多个连接的情况
         */
        String pathChar = "/";
        String pathCharLin = "/";
        String pathCharWin = "\\";
        //		char[] mychar = path.toCharArray();
        if (pathCharLin.equalsIgnoreCase(File.separator)) {
            pathChar = "/";
        }
        if (pathCharWin.equalsIgnoreCase(File.separator)) {
            pathChar = "\\\\";
        }
        rtp = FileOperator.replaceString("\\\\+|/+", inputPath, "/");
        rtp = FileOperator.replaceString("/+", rtp, pathChar);
        /**
         * 这是使用正常的循环进行替换
         */
        /***********************************************************************
         * / String path = inputPath; char pathChar = '/'; char pathCharLin =
         * '/'; char pathCharWin = '\\'; char[] mychar = path.toCharArray();
         * if(String.valueOf((pathCharWin)).equalsIgnoreCase(File.separator)) {
         * pathChar = pathCharWin; }
         * if(String.valueOf((pathCharLin)).equalsIgnoreCase(File.separator)) {
         * pathChar = pathCharLin; } for(int i = 0;i <mychar.length;i++) {
         * if(mychar[i] == pathCharWin || mychar[i] == pathCharLin) { mychar[i] =
         * pathChar; } if(mychar[i] != pathCharLin && mychar[i] != pathCharWin)
         * rtp += String.valueOf(mychar[i]); if(i <mychar.length-1) {
         * if(mychar[i] == pathChar && mychar[i+1] != pathChar && mychar[i+1] !=
         * pathCharWin && mychar[i+1] != pathCharLin) { rtp +=
         * String.valueOf(mychar[i]); } } } /
         **********************************************************************/
        return rtp;
    }

    /**
     * 将路径转换为linux路径－也可使用为将http的相对路径进行转换
     *
     * @param inputPath
     * @return String
     */
    public static String toLinuxStanderds(String inputPath) {
        String rtp = "";
        /**
         * 这是使用正则表达式进行替换
         */
        rtp = FileOperator.replaceString("\\\\+|/+", inputPath, "/");
        rtp = FileOperator.replaceString("/+", rtp, "/");
        /**
         * 这是使用正常的循环进行替换
         */
        /***********************************************************************
         * / String path = inputPath; char pathChar = '/'; char pathCharLin =
         * '/'; char pathCharWin = '\\'; char[] mychar = path.toCharArray();
         * if(String.valueOf((pathCharWin)).equalsIgnoreCase(File.separator)) {
         * pathChar = pathCharWin; }
         * if(String.valueOf((pathCharLin)).equalsIgnoreCase(File.separator)) {
         * pathChar = pathCharLin; } pathChar = '/'; for(int i = 0;i
         * <mychar.length;i++) { if(mychar[i] == pathCharWin || mychar[i] ==
         * pathCharLin) { mychar[i] = pathChar; } if(mychar[i] != pathCharLin &&
         * mychar[i] != pathCharWin) rtp += String.valueOf(mychar[i]); if(i
         * <mychar.length-1) { if(mychar[i] == pathChar && mychar[i+1] !=
         * pathChar && mychar[i+1] != pathCharWin && mychar[i+1] != pathCharLin) {
         * rtp += String.valueOf(mychar[i]); } } } /
         **********************************************************************/
        return rtp;
    }

    /**
     * 在已经存在的路径下创建文件夹
     *
     * @param path
     * @return boolean
     */
    public static boolean createFolder(String path/* ,String folderName */) {
        //String fPath = path + File.separator + folderName;
        File file = new File(path);
        boolean returnBoolean = file.mkdir();
        return returnBoolean;
    }

    /**
     * 删除文件夹，当该文件夹下有文件或者文件夹的时候不能删除该文件夹
     *
     * @param path
     * @return boolean
     */
    public static boolean deleteFolder(String path/* ,String folderName */) {
        //String fPath = path + File.separator + folderName;
        File file = new File(path);
        boolean returnBoolean = file.delete();
        return returnBoolean;
    }

    /**
     * 创建文件或者文件夹
     *
     * @param path
     * @param fileName
     * @return boolean
     */
    public static boolean createFile(String path, String fileName) {
        String fPath = path + File.separator + fileName;
        File file = new File(fPath);
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean createFile(String path, byte[] bytes) {
        try {
            if (!new File(path).exists()) {
                new File(path).createNewFile();
            }
            FileOutputStream fos = new FileOutputStream(path);
            fos.write(bytes);
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean createFile(String path, String content,String code) {
        try {
            if (!new File(path).exists()) {
                new File(path).createNewFile();
            }
            OutputStreamWriter op = new OutputStreamWriter(new FileOutputStream(path), code);
            op.append(content);
            op.flush();
            op.close();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean createFile(String path, InputStream inputStream) {
        try {
            if (!new File(path).exists()) {
                new File(path).createNewFile();
            }
            FileOutputStream fos = new FileOutputStream(path);
            IOUtils.copyLarge(inputStream, fos);

            if (inputStream != null) {
                inputStream.close();
            }
            if (fos != null) {
                fos.flush();
                fos.close();

            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean createFile(String fileName) {
        String fPath = fileName;
        File file = new File(fPath);
        try {
            file.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    /**
     * 替换函数
     *
     * @param pattern    正则表达式
     * @param inputStr   要替换的字符串
     * @param replaceStr 要被替换的字符串
     * @return String 替换之后的结果
     */
    public static String replaceString(String pattern, String inputStr, String replaceStr) {
        java.util.regex.Pattern p = null; //正则表达式
        java.util.regex.Matcher m = null; //操作的字符串
        String value = "";
        try {//['%\"|\\\\]校验非法字符.'"|\正则表达式
            //^[0-9]*[1-9][0-9]*$
            //"['%\"|\n\t\\\\]"
            //校验是否全部是空格：[^ ]
            p = java.util.regex.Pattern.compile(pattern);
            m = p.matcher(inputStr);
            value = m.replaceAll(replaceStr);
            m = p.matcher(value);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return value;
    }



    private static void createDirectory(String directory, String subDirectory) {
        String dir[];
        File fl = new File(directory);
        try {
            if (subDirectory == "" && fl.exists() != true) {
                fl.mkdir();
            } else if (subDirectory != "") {
                dir = subDirectory.replace('\\', '/').split("/");
                for (int i = 0; i < dir.length; i++) {
                    File subFile = new File(directory + File.separator + dir[i]);
                    if (subFile.exists() == false)
                        subFile.mkdir();
                    directory += File.separator + dir[i];
                }
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }


    public static void doDeleteFile(File parentFile) {
        File[] childFiles = parentFile.listFiles();
        for (File singleFile : childFiles) {
            if (singleFile.isDirectory()) {
                //递归
                doDeleteFile(singleFile);
            } else {
                singleFile.delete();
            }
        }
        parentFile.delete();
    }


    public static List<String> uploadFile(HttpServletRequest request, String destPath) {
        List<String> retVal = new ArrayList<>();
        //解析器解析request的上下文
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //先判断request中是否包涵multipart类型的数据，
        if (multipartResolver.isMultipart(request)) {
            if (!FileOperator.isFileExist(destPath)) {
                FileOperator.createDirectory(destPath, destPath);
            }
            //再将request中的数据转化成multipart类型的数据
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile((String) iter.next());
                if (file.isEmpty()) {
                    continue;
                }
                String fileName = file.getOriginalFilename();
                //保存文件至本地
                String finalName = new SimpleDateFormat("yyyyMMddhhmmssSSS").format(new Date()) + "_" + fileName;
                String fullPath = destPath + File.separator + finalName;
                try {
                    if (FileOperator.createFile(fullPath, file.getBytes())) {
                        retVal.add(fullPath);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return retVal;
    }


    /**
     * 获取目录下面所有文件的路径列表
     *
     * @param folderPath
     * @return
     */
    public static List<String> getChildFilePath(String folderPath) {

        List<String> filePathList = new ArrayList<>();
        File parentFile = new File(folderPath);
        if (parentFile.exists() == false) {
            return filePathList;
        }
        File[] childFiles = parentFile.listFiles();
        for (File singleFile : childFiles) {
            if (singleFile.isDirectory()) {
                continue;
            } else {
                filePathList.add(singleFile.getPath());
            }
        }
        return filePathList;
    }


    /**
     * 获取文件夹及其子文件夹中的文件路径
     *
     * @param folderPath
     * @param pathList
     * @return
     */
    public static boolean getChildFilePath(String folderPath, List<String> pathList) {
        // List<String> filePathList = new ArrayList<>();
        File parentFile = new File(folderPath);
        if (parentFile.exists() == false) {
            return true;
        }
        File[] childFiles = parentFile.listFiles();
        for (File singleFile : childFiles) {
            if (singleFile.isDirectory()) {
                getChildFilePath(singleFile.getPath(), pathList);
            } else {
                // filePathList.add(singleFile.getPath());
                pathList.add(singleFile.getPath());
            }
        }
        return true;
    }

    /**
     * 判断是否是图片类型
     *
     * @param filePath
     * @return
     */
    public static Boolean isImage(String filePath) {
        Boolean retVal = false;
        try {
            BufferedImage image = ImageIO.read(new File(filePath));
            if (null != image) {
                retVal = true;
            }
        } catch (IOException e) {
            System.out.println(filePath + ":file not find.");
        }
        return retVal;
    }

}