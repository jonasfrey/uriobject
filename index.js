// import me like this <script src="..." type="module"></script>
// ^ if you get: Uncaught SyntaxError: Unexpected token {
// ^ if you get: Uncaught SyntaxError: Unexpected token export
/*
import {
  IsDependingOn
}
from './IsDependingOn.js';
*/

class uriobject {
    constructor(string) {
      /**
       * naming
       * 
       * scheme(): http, https, ftp, mailto, file, data, irc
       * userinfo(): username:password@
       * host(): subone.subtwo.subanother.domain.com
       * port(): 8080
       * path():  /index.html or /path/to/folder or /path/to/file
       * query(): asdf=1&b=c
       * fragment(): #some_tag_anchor
       * 
       */
      //string examples
      //uri schemes  https://en.wikipedia.org/wiki/List_of_URI_schemes
      /**
       * protocol 
       * so far i could only get the browser trying to load these 
       * http://
       * https://
       * ftp://
       * but not all listed here 
       * https://en.wikipedia.org/wiki/Diameter_(protocol)
       * dns://
       * ... 
       * only ipv4, ipv6, domain, subdomain domain
       * 111.111.111.111
       * [1080::8:800:200c:417a]
       * domain.com
       * sub.domain.com
       * localhost
       * sub.localhost
       * 
       * 
       * ipv4, ipv6, domain, subdomain domain, all with port and or user
       * asdf:pass@111.111.111.111:11
       * user:passw@[1080::8:800:200c:417a]:22
       * user:pass@domain.com:333
       * us:pas@sub.domain.com:11235
       * as:pa@localhost
       * us:pas@sub.localhost
       * 
       * 
       * ipv4, ipv6, domain, subdomain domain, all with port and or user
       * asdf:pass@111.111.111.111:11
       * user:passw@[1080::8:800:200c:417a]:22
       * user:pass@domain.com:333
       * us:pas@sub.domain.com:11235
       *
       * 155.111.111.111/asdf/filename.ext
       * domainwithoutprotocol.com/foldername/filenamewithoutext
       * sub.domainwithoutprotocol.com/folder.name.cont.dot/foldername
       * http://sub.domwithprot.com/
       * 
       * http://sub.domain.two.com/asdf.asdf/asdf
       * 
       * one can also pass only a file but then the path must start with ./ if it is 
       * or with / 
       * so:
       * './thats.my.file'
       * or 
       * '/var/www/node/thats.my.file'
       */

       //aliases
       this.alias_table = {
       
        'protocol':'scheme',
        'user_pass':'userinfo',
        'domain':'host',
        'portnumber':'port',
        'pathfile':'path',
        'requestquery':'query',
        'anchortag':'fragment',

      };

      this.set_properties(string);
      return new Proxy(this, 
        {
          get: function(obj, name){
            //console.log("proxy get", obj, name);
            if(name == 'uri'){
              var uri = '';
              if(obj.scheme != null){
                uri += obj.scheme + "://";
              }
              if(obj.userinfo != null){
                uri += obj.userinfo + "@";
              }
              if(obj.host != null){
                uri += obj.host;
              }
              if(obj.port != null){
                uri += ":" + obj.port;
              }
              if(obj.path != null){
                uri += obj.path;
              }
              if(obj.query != null){
                uri += "?" + obj.query;
              }
              if(obj.fragment != null){
                uri += "#" + obj.fragment;
              }
              return uri;
            }
            var alias = obj.alias_table[name];
            if(alias != undefined){
              return obj[alias];
            }
            return obj[name];
          },
          set: function(obj, name, value){
            
            
            var new_name = name;
            var alias = obj.alias_table[name];
            if(alias != undefined){
              var new_name = alias;
            }
            var regexes = {
              'scheme': '(http|https|ftp|mailto|file|data|irc)',
              'userinfo': '.*:.*',
              'host': '.*',
              'port': '^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
              'path': '.*',
              'query': '.*',
              'fragment': '.*',
            };
            var regex = regexes[new_name];
            if(regex != undefined && value != null){
              var match = value.toString().match(new RegExp(regex));

              if(match == null){
                console.error("cannot set the property '"+new_name + '\''+ ((new_name != name) ? " (alias) '"+ name +"'": '') + ": the value '"+ value +"' does not match the regex " + regex)
                return false;
              }
            }
            return obj[new_name] = value;
            
          }
        })
      
    }
  
    usage_example(){
      return `
      this documentation is written in [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
      ![https://en.wikipedia.org/wiki/URL#/media/File:URI_syntax_diagram.svg](https://en.wikipedia.org/wiki/URL#/media/File:URI_syntax_diagram.svg) 
      # create new instance
      \`\`\`javascript
      var uripartsobject = new uriobject('http://you:pass@ex.com/path/file?query=string#tag');
      \`\`\`
      
      # access get data 
      empty data will be null
      \`\`\`javascript
      console.log(uripartsobject.scheme);//returns 'http'
      /**
       * uripartsobject
       * {
       *  'scheme': 'http',
       *  'userinfo': 'you:pass',
       *  'host': 'ex.com',
       *  'port': null,
       *  'path': '/path/file',
       *  'query': '?query=sttring',
       *  'fragment': 'tag',
       *  'uri': 'http://you:pass@ex.com/path/file?query=string#tag',
       * ...
       * }
       * /
      \`\`\`

      # access set data 
      empty data will be null
      \`\`\`javascript
      uripartsobject.scheme = 'https';
      //you can set data to null
      uripartsobject.userinfo = null;
      \`\`\`

      # access get data after set data 
      empty data will be null
      \`\`\`javascript
      /**
       * uripartsobject
       * {
       *  'scheme': 'https',
       *  'userinfo': null,
       *  'host': 'ex.com',
       *  'port': null,
       *  'path': '/path/file',
       *  'query': '?query=sttring',
       *  'fragment': 'tag',
       *  'uri': 'https://@ex.com/path/file?query=string#tag',
       * ...
       * }
       * /
      \`\`\`

      uripartsobject.scheme = https; 
      uripartsobject.userinfo = null; 
      console.log(uripartsobject.uri);//returns https://ex.com/path/file?query=string#tag
      \`\`\`

      `;
    }
    /*
    get_testurls() {
        return [
        "./only/a/relative/path",
        "./only/a/relative/path.exe",
        "./only/a/relative/path.exe.asdf",
        "./only/a/relative/path.exe.asdf/asdf.exe",
        "./only/a/relative/path.exe.asdf/asdf.exe@some.exe",
        "./only/a/relative/path.exe.asdf/asdf.exe@some.exe/asdf",
        "./only/a/relative/path.exe.asdf/asdf.exe@some.exe/asdf/",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe/.././asdf",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe/.././asdf/",
        "/one/absolute/path",
        "/one/absolute/path.exe",
        "/one/absolute/path.exe.asdf",
        "/one/absolute/path.exe.asdf/asdf.exe",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe/.././asdf",
        "/one/absolute/path.exe.asdf/asdf.exe@some.exe/asdf/asdf.exe/.././asdf/",
         "http://foo.com/blah_blah",
         "http://foo.com/blah_blah/",
         "http://foo.com/blah_blah_(wikipedia)",
         "http://www.example.com/wpstyle/?p=364",
         "http://www.example.com/wpstyle?p=364",
         "https://www.example.com/foo/?bar=baz&inga=42&quux",
         "http://✪df.ws/123",
         "http://userid:password@example.com:8080",
         "http://userid:password@example.com:8080/",
         "http://userid@example.com",
         "http://userid@example.com/",
         "http://userid@example.com:8080",
         "http://userid@example.com:8080/",
         "http://userid:password@example.com",
         "http://userid:password@example.com/",
         "http://142.42.1.1/",
         "http://142.42.1.1:8080/",
         "http://➡.ws/䨹",
         "http://⌘.ws",
         "http://⌘.ws/",
         "http://foo.com/blah_(wikipedia)#cite-1",
         "http://foo.com/blah_(wikipedia)_blah#cite-1",
         "http://foo.com/unicode_(✪)_in_parens",
         "http://foo.com/(something)?after=parens",
         "http://☺.damowmow.com/",
         "http://code.google.com/events/#&product=browser",
         "http://j.mp",
         "ftp://foo.bar/baz",
         "http://foo.bar/?q=Test%20URL-encoded%20stuff",
         "http://مثال.إختبار",
         "http://例子.测试",
         "http://उदाहरण.परीक्षा",
         "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
         "http://1337.net",
         "http://a.b-c.de",
         "http://223.255.255.254",
         "https://foo_bar.example.com/",
         "http://",
         "http://.",
         "http://..",
         "http://../",
         "http://?",
         "http://??",
         "http://??/",
         "http://#",
         "http://##",
         "http://##/",
         "http://foo.bar?q=Spaces should be encoded",
         "//",
         "//a",
         "///a",
         "///",
         "http:///a",
         "foo.com",
         "rdar://1234",
         "h://test",
         "http:// shouldfail.com",
         ":// should fail",
         "http://foo.bar/foo(bar)baz quux",
         "ftps://foo.bar/",
         "http://-error-.invalid/",
         "http://a.b--c.de/",
         "http://-a.b.co",
         "http://a.b-.co",
         "http://0.0.0.0",
         "http://.www.foo.bar/",
         "http://www.foo.bar./",
         "http://.www.foo.bar./",
         "http://10.1.1.1", 
         "http://10.1.1.254"
        ]
    }
    */
  
    /**
     * @return object
     */
    get_seps() {
      return {
        scheme: "://",
        userinfo: "@",
        query: "?",
        fragment: "#",
        path: "/",
        port: ":",
        ipv6_closing_bracket: "]",
        file_extension: "."
      };
    }
    /**
     * 
     * @param {string} string 
     * @return {class} class 
     */
    set_properties(string) {
      var seps = this.get_seps();
      this.input = string;
      var tmp_string = string;
      var parts = [];
      //must be first !
      //try to pop away fragment
      parts = tmp_string.split(seps.fragment);
      if(parts.length > 1){
        this.fragment = parts.pop();
      }else{
        this.fragment = null;
      }
      tmp_string = parts.join(seps.tag);


      //try to pop away query string, 


      parts = tmp_string.split(seps.query)
  
  
  
      if (parts.length > 1) {
        tmp_string = parts.shift();
        this.query = parts.join(seps.query);
      } else {
        tmp_string = string;
        this.query = null;
      }
  
  
      //try to shift away scheme
      parts = tmp_string.split(seps.scheme);
  
      this.scheme = (parts.length > 1) ? parts.shift() : null;
  
      tmp_string = parts.join(seps.scheme);
  
  
  
      //what if asdf.yess.com
  
      //try to shift away user:pass@domain.com
      /*
  
      */
  
      //try to shift away domain 
      parts = tmp_string.split(seps.path);
  
      //if './file.could.be.exe' parts == ['.', 'file.could.be.exe']
      //if '/var/absolutepath/file.could.be.exe' parts == ['','var', 'absolutepath', 'file.could.be.exe']
  
      if (parts[0].indexOf('.') == 0 || parts[0] == '.' || parts[0] == '') {
        this.host = null;
        this.userinfo = null;
        this.port = null;
      } else {
        var host_userinfo_port = parts.shift();
        tmp_string = seps.path + parts.join(seps.path);
  
        //try to shift away userinfo
        parts = host_userinfo_port.split(seps.userinfo);
  
        this.userinfo = (parts.length > 1) ? parts.shift() : null;
  
        host_userinfo_port = parts.join(seps.userinfo);
  
        //try to pop away port 
        //if ipv4 port_separator == ':', 
        //if ipv6 port_separator == ':]'
        var port_separator = (host_userinfo_port.indexOf(seps.ipv6_closing_bracket) != -1) ? seps.ipv6_closing_bracket + seps.port : seps.port;
  
        parts = host_userinfo_port.split(port_separator);
  
        this.port = (parts.length > 1) ? parts.pop() : null;
  
        this.host = parts.join(port_separator);
  
      }

      this.path = tmp_string;

      //we can not differenciate files from directories, since 
      // 'this_is_a_dir.jpg' is a legit directory name!
      // of 'this_is_a_jpg_file' is a legit file name

      // //path is existing /asdf/asdf.ext
      // if (parts.length > 0) {
      //   //pop away file 
  
      //   var file_name = parts.pop();
      //   tmp_string = parts.join(seps.path) + seps.path;
  
      //   this.file_name = file_name;
      //   this.file_name = (this.file_name == '') ? null : this.file_name;
  
      //   /*
      //   parts = tmp_string.split(seps.path);
      //   parts = parts.filter(Boolean);
      //   tmp_string = parts.join(seps.path);
      //   */
      //   if (tmp_string == "") {
      //     tmp_string = "/";
      //   }
  
      //   this.path = tmp_string;
  
      // }
  
    }

  
  
  }
  export {
    uriobject
  }
